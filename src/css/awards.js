const awardImages = Array.from({ length: 9 }, (_, index) =>
  `../assets/image/Award%20Winning%20${index + 1}.jpg`,
);

const awardImageElements = document.querySelectorAll("[data-award-image]");

if (awardImageElements.length === 4) {
  let firstImageIndex = 0;

  const updateAwards = () => {
    awardImageElements.forEach((image, slot) => {
      const imageIndex = (firstImageIndex + slot) % awardImages.length;
      image.src = awardImages[imageIndex];
      image.alt =
        slot === 0
          ? "C.M. Yen receiving an award"
          : `Award recognition photo ${imageIndex + 1}`;
    });
    firstImageIndex = (firstImageIndex + 1) % awardImages.length;
  };

  window.setInterval(updateAwards, 5000);
}
