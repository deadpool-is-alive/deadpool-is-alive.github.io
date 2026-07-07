const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');


if(form){
  form.addEventListener('submit', async (e) => {
    // e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
    
    btn.disabled = true;  
    btn.style.opacity = '0.7';

    try{
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if(response.ok){
        form.reset();
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4000);
      } else{
        alert("Failed to send message");
      }
    } catch(err){
      alert("Something went wrong.")
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = "1";
      }
  });
}