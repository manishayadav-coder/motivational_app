window.onload = () => {
  const quote = localStorage.getItem("currentQuote");
  const user = localStorage.getItem("currentUser");
  const image = localStorage.getItem("currentImage");

  document.getElementById("quoteText").innerText = quote || "No quote found!";
  document.getElementById("quoteAuthor").innerText = user ? `- ${user}` : "";
  document.getElementById("userImage").src = image || "https://via.placeholder.com/500";

  // LIKE button
  document.getElementById("likeBtn").addEventListener("click", () => {
    const btn = document.getElementById("likeBtn");
    btn.classList.add("animate");
    setTimeout(() => btn.classList.remove("animate"), 600);
  });

  // COMMENT button
  document.getElementById("commentBtn").addEventListener("click", () => {
    const box = document.getElementById("commentBox");
    box.style.display = box.style.display === "block" ? "none" : "block";
  });

  // POST COMMENT
  document.getElementById("postComment").addEventListener("click", () => {
    const input = document.getElementById("commentInput");
    const comment = input.value.trim();
    if (comment) {
      const commentList = document.getElementById("commentList");
      const li = document.createElement("li");
      li.textContent = comment;
      commentList.appendChild(li);

      input.value = "";
      document.getElementById("commentBox").style.display = "none";
    }
  });

  // FAVOURITE button
  document.getElementById("favouriteBtn").addEventListener("click", () => {
    let favourite = JSON.parse(localStorage.getItem("favourite")) || [];
    favourite.push({ quote, user, image });
    localStorage.setItem("favourite", JSON.stringify(favourite));

    const btn = document.getElementById("favouriteBtn");
    btn.classList.add("animate-heart");
    setTimeout(() => btn.classList.remove("animate-heart"), 600);
  });

  // SHARE button
  document.getElementById("shareBtn").addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Motivational Quote",
          text: `${quote} \n${user ? "- " + user : ""}`,
          url: window.location.href
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  });
};
