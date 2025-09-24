function generatePDF() {
  document.getElementById("outName").innerText = document.getElementById("name").value;
  document.getElementById("outFather").innerText = document.getElementById("father").value;
  document.getElementById("outMother").innerText = document.getElementById("mother").value;
  document.getElementById("outDOB").innerText = document.getElementById("dob").value;
  document.getElementById("outAddress").innerText = document.getElementById("address").value;
  document.getElementById("outMobile").innerText = document.getElementById("mobile").value;
  document.getElementById("outEmail").innerText = document.getElementById("email").value;
  document.getElementById("outObjective").innerText = document.getElementById("objective").value;

  document.getElementById("outEdu10Year").innerText = document.getElementById("edu10Year").value;
  document.getElementById("outEdu10Board").innerText = document.getElementById("edu10Board").value;
  document.getElementById("outEdu10Perc").innerText = document.getElementById("edu10Perc").value;

  document.getElementById("outEdu12Year").innerText = document.getElementById("edu12Year").value;
  document.getElementById("outEdu12Board").innerText = document.getElementById("edu12Board").value;
  document.getElementById("outEdu12Perc").innerText = document.getElementById("edu12Perc").value;

  document.getElementById("outEduGradYear").innerText = document.getElementById("eduGradYear").value;
  document.getElementById("outEduGradBoard").innerText = document.getElementById("eduGradBoard").value;
  document.getElementById("outEduGradPerc").innerText = document.getElementById("eduGradPerc").value;

  document.getElementById("outEduPgYear").innerText = document.getElementById("eduPgYear").value;
  document.getElementById("outEduPgBoard").innerText = document.getElementById("eduPgBoard").value;
  document.getElementById("outEduPgPerc").innerText = document.getElementById("eduPgPerc").value;

  document.getElementById("outExpCompany1").innerText = document.getElementById("expCompany1").value;
  document.getElementById("outExpRole1").innerText = document.getElementById("expRole1").value;
  document.getElementById("outExpDuration1").innerText = document.getElementById("expDuration1").value;
  document.getElementById("outExpResp1").innerText = document.getElementById("expResp1").value;

  document.getElementById("outExpCompany2").innerText = document.getElementById("expCompany2").value;
  document.getElementById("outExpRole2").innerText = document.getElementById("expRole2").value;
  document.getElementById("outExpDuration2").innerText = document.getElementById("expDuration2").value;
  document.getElementById("outExpResp2").innerText = document.getElementById("expResp2").value;

  document.getElementById("outExtraQual").innerText = document.getElementById("extraQual").value;
  document.getElementById("outHobbies").innerText = document.getElementById("hobbies").value;

  let langs = [];
  if(document.getElementById("langHindi").checked) langs.push("Hindi");
  if(document.getElementById("langEnglish").checked) langs.push("English");
  document.getElementById("outLanguages").innerText = langs.join(", ");

  document.getElementById("outDeclaration").innerText = document.getElementById("declaration").value;
  document.getElementById("outPlace").innerText = document.getElementById("place").value;
  document.getElementById("outDate").innerText = document.getElementById("date").value;

  let photoFile = document.getElementById("photo").files[0];
  if (photoFile) {
    let reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("outPhoto").src = e.target.result;
    };
    reader.readAsDataURL(photoFile);
  }

  let signFile = document.getElementById("signature").files[0];
  if (signFile) {
    let reader2 = new FileReader();
    reader2.onload = function(e) {
      document.getElementById("outSignature").src = e.target.result;
    };
    reader2.readAsDataURL(signFile);
  }

  setTimeout(createPDF, 600);
}

function createPDF() {
  let resume = document.getElementById("resumeOutput");
  resume.style.display = "block";

  html2canvas(resume).then(canvas => {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF("p","pt","a4");
    let imgData = canvas.toDataURL("image/png");
    let pageWidth = pdf.internal.pageSize.getWidth();
    let imgHeight = canvas.height * pageWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save("Professional_Resume.pdf");
    resume.style.display = "none";
  });
}