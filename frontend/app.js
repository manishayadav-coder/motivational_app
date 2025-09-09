// ✅ Backend URL (localhost की जगह हमेशा online URL डालो)
const API_BASE = "https://yourapp.cyclic.app";  

// Elements
const showBtn = document.getElementById("show-quote");
const formContainer = document.getElementById("formContainer");
const quoteSection = document.getElementById("quoteSelection");
const quoteList = document.getElementById("quoteList");

let uploadedPostId = null;

if (showBtn) {
  showBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const imageInput = document.getElementById("imageUpload").files[0];

    if (!username) {
      alert("⚠️ Please enter your name!");
      return;
    }
    if (!imageInput) {
      alert("⚠️ Please upload your image or video!");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageInput);
    formData.append("name", username);
    formData.append("quote", ""); 

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      uploadedPostId = data.post.id;
      formContainer.style.display = "none";
      quoteSection.style.display = "block";
      loadQuotes();
    } catch (err) {
      console.error("Upload error:", err);
      alert("⚠️ Failed to upload!\n" + err.message);
    }
  });
}

// Fetch & display all posts
async function loadQuotes() {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    const posts = await res.json();

    quoteList.innerHTML = "";
    posts.forEach((post) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${post.name}</strong>: ${post.quote || "(no quote yet)"}<br>
        ${post.type === "video" 
          ? `<video src="${post.file}" width="200" controls></video>` 
          : `<img src="${post.file}" width="150"/>`}
        <button onclick="deletePost(${post.id})">🗑 Delete</button>
      `;
      quoteList.appendChild(li);
    });
  } catch (err) {
    console.error("Load quotes error:", err);
    alert("⚠️ Failed to load posts!\n" + err.message);
  }
}

async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    await fetch(`${API_BASE}/posts/${id}`, { method: "DELETE" });
    loadQuotes();
  } catch (err) {
    console.error("Delete error:", err);
  }
}
