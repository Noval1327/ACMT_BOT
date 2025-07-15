//proses upload file
$(document).on("submit", "#form-upload", function (e) {
  e.preventDefault();
  e.stopPropagation();
  const files = $("#dropzone-file")[0].files;
  // Lakukan AJAX request untuk mengunggah file
  let formData = new FormData(this);
  // Reset kontainer file
  $("#uploadedFile-container").text("");
  // Loop setiap file yang di-drop

  const allowedExtensions = [".pdf", ".xls", ".xlsx"];
  const maxFileSize = 5 * 1024 * 1024; // 10 MB
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/upload", true);
  if (files) {
    const fileExtension = files[0].name.split(".").pop().toLowerCase();
    if (
      !allowedExtensions.includes(`.${fileExtension}`) ||
      files[0].size > maxFileSize
    ) {
      notyf.error(
        "hanya dokumen berekstensi pdf, excel dan ukuran maksimal 10 MB yang diperbolehkan!"
      );
      e.preventDefault();
      return;
    }
    xhr.onload = function () {
      if (xhr.status === 200) {
        hideModal();
        notyf.success("Berhasil upload file!");
      } else {
        notyf.error("Gagal upload file!");
      }
    };
    xhr.send(formData);
  }
});
