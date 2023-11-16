$.get(
  "https://api.noName.ro/api/v1/strapi/content/terms_of_services",
  (data) => {
    const md = new Remarkable();
    document.getElementById("markdown").innerHTML = md.render(
      data.data.content
    );
    $("#loading").hide();
  }
);
