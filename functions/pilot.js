// Cloudflare Pages Function: tar emot pilotanmälan från cimpla.se och mejlar den
// via Microsoft Graph (app-only, client credentials). Ersätter Netlify Forms,
// som slutade fungera vid flytten till Cloudflare.
//
// Workers-runtimen kör inte Node/msal, så OAuth-token hämtas manuellt med fetch.
//
// Miljövariabler (sätts i Cloudflare Pages → Settings → Variables and secrets):
//   GRAPH_TENANT_ID      custom46-tenantens id      (= Custom46_GRAPH_TENANT_ID)
//   GRAPH_CLIENT_ID      app-registreringens id     (= Custom46_GRAPH_CLIENT_ID)
//   GRAPH_CLIENT_SECRET  client secret  [SECRET]    (= Custom46_GRAPH_CLIENT_SECRET)
//   GRAPH_SENDER         hugo.bodinson@custom46.com (avsändarbrevlåda appen når)
//   NOTIFY_TO            kontakt@custom46.com        (dit anmälan skickas)

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();

    // Honungsfälla: bottar fyller det dolda fältet. Kvittera 200 så de inte
    // fortsätter försöka, men skicka inget mejl.
    if ((form.get("bot-field") || "").toString().trim() !== "") {
      return new Response("ok", { status: 200 });
    }

    const email = (form.get("email") || "").toString().trim();
    const meddelande = (form.get("meddelande") || "").toString().trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response("Ogiltig mejladress.", { status: 400 });
    }

    for (const k of ["GRAPH_TENANT_ID", "GRAPH_CLIENT_ID", "GRAPH_CLIENT_SECRET",
                     "GRAPH_SENDER", "NOTIFY_TO"]) {
      if (!env[k]) return new Response("Serverkonfiguration saknas: " + k, { status: 500 });
    }

    // 1) app-only-token
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${env.GRAPH_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.GRAPH_CLIENT_ID,
          client_secret: env.GRAPH_CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
      });
    if (!tokenRes.ok) return new Response("Kunde inte autentisera mot Graph.", { status: 502 });
    const access_token = (await tokenRes.json()).access_token;
    if (!access_token) return new Response("Ingen token från Graph.", { status: 502 });

    // 2) skicka mejlet. Avsändare = affärsbrevlådan; svar går till anmälaren.
    const text =
      "Ny pilotanmälan från cimpla.se\n\n" +
      "Mejl: " + email + "\n\n" +
      "Meddelande:\n" + (meddelande || "(inget)") + "\n";
    const payload = {
      message: {
        subject: "Pilotanmälan cimpla: " + email,
        body: { contentType: "Text", content: text },
        toRecipients: [{ emailAddress: { address: env.NOTIFY_TO } }],
        replyTo: [{ emailAddress: { address: email } }],
      },
      saveToSentItems: false,
    };
    const sendRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.GRAPH_SENDER)}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    if (!sendRes.ok) return new Response("Kunde inte skicka mejlet.", { status: 502 });

    return new Response("ok", { status: 200 });
  } catch (e) {
    return new Response("Oväntat fel.", { status: 500 });
  }
}
