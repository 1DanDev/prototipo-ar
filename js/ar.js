const arTargets = document.querySelectorAll(
  "[mindar-image-target][data-person-id]"
);


arTargets.forEach((target) => {

  const personId =
    target.dataset.personId;


  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "Target encontrado:",
        personId
      );


      window.dispatchEvent(

        new CustomEvent(
          "person-found",
          {
            detail: {
              personId: personId
            }
          }
        )

      );

    }
  );


  target.addEventListener(
    "targetLost",
    () => {

      console.log(
        "Target perdido:",
        personId
      );


      window.dispatchEvent(

        new CustomEvent(
          "person-lost",
          {
            detail: {
              personId: personId
            }
          }
        )

      );

    }
  );

});