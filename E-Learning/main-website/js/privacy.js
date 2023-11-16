$.get("https://api.noName.ro/api/v1/strapi/content/privacy_policy", (data) => {
  const md = new Remarkable();
  document.getElementById("markdown").innerHTML = md.render(data.data.content);
  $("#loading").hide();
});
