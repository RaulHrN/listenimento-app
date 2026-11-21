// Configuração dinâmica do Expo: herda tudo do app.json e permite que o CI
// defina a versão (APP_VERSION) e o versionCode do Android (ANDROID_VERSION_CODE).
// Assim cada APK gerado pelo GitHub Actions instala por cima do anterior.
module.exports = ({ config }) => ({
  ...config,
  version: process.env.APP_VERSION || config.version,
  android: {
    ...config.android,
    versionCode: Number(process.env.ANDROID_VERSION_CODE || config.android?.versionCode || 1),
  },
});
