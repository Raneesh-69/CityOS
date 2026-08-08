// Simple script to emulate client POST /api/auth/login using fetch
const url = "https://cityos-8f1x.onrender.com/api/auth/login";
const credentials = {
  email: "test20260808-003@example.com",
  password: "Password123",
};

(async () => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("Status:", res.status);
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (contentType.includes("application/json")) {
      console.log("Response JSON:", JSON.parse(text));
    } else {
      console.log("Response Text:", text);
    }
  } catch (err) {
    console.error("Error:", err.message || err);
  }
})();
