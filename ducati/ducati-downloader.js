const fetch = require("node-fetch");
const fs = require("fs");
const bikes = require("./bikes");

async function go({ yearBooklets, familyBooklets, modelBooklets }) {
  const filename = await fetch(
    `http://www.ducatiusa.com/en/service/service.do?task=downloadDocument&type=booklets&yearBooklets=${yearBooklets}&familyBooklets=${familyBooklets}&modelBooklets=${
      modelBooklets.value
    }&langBooklets=103`,
    {
      credentials: "include",
      headers: {},
      referrer: "http://www.ducatiusa.com/services/maintenance/index.do",
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    }
  ).then(response => response.text());

  const pdf = await fetch("http://www.ducatiusa.com/" + filename, {
    credentials: "include",
    headers: {},
    referrer: "http://www.ducatiusa.com/services/maintenance/index.do",
    referrerPolicy: "no-referrer-when-downgrade",
    body: null,
    method: "GET",
    mode: "cors"
  }).then(response => response.buffer());

  fs.writeFileSync(
    `${yearBooklets}_ducati_${modelBooklets.label
      .toLowerCase()
      .trim()
      .replace(" ", "_")}.pdf`,
    pdf
  );
  console.log("done");
}

Object.keys(bikes).forEach(year => {
  const familyBooklets = bikes[year];
  familyBooklets.forEach(fBooklet => {
    const mBooklets = fBooklet.modelBooklets;
    mBooklets.forEach(mBooklet => {
      go({
        yearBooklets: year,
        familyBooklets: fBooklet.familyBooklets,
        modelBooklets: mBooklet
      });
    });
  });
});
