const SUPABASE_URL = "https://rqcjdmphaafnfblkyatm.supabase.co";
const SUPABASE_KEY = "sb_publishable__bAyNlDi1_1b70ezax5ksA_OS17CIuV";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
const IMG={
power:"https://brlhc31l9m.tenbytecdn.com/assets/images/products/power-bank/product_12652_main.webp?w=900",
head:"https://down-th.img.susercontent.com/file/th-11134207-7r98y-lpew7auec3ged6",
mouse:"https://pacoecuador.vtexassets.com/arquivos/ids/431579-150-auto?aspect=true&height=auto&v=638890932153170000&width=150",
ear:"https://www.e-shop.gr/images/TEL/ART2/TEL.231240_5.jpg"
};
const STORE_DEFAULTS={name:"ZENVIX Store",tagline:"TECH • GAMING • ACCESSORIES",phone:"+880 1XXXXXXXXX",email:"",topMessage:"🚚 Nationwide delivery • Cash on Delivery • Easy order tracking",heroTitle:"Tech that fits your life & game.",heroText:"Premium electronics, gaming gear and everyday accessories — with Bangladesh-friendly prices and convenient delivery.",promoLabel:"LIMITED OFFERS",promoTitle:"Deals of the day",promoEnabled:true,deliveryInfo:"ডেলিভারি ৭ দিনের মধ্যে আপনার হাতে পৌঁছে যাবে।\nপণ্য ফেরত দিতে চাইলে ফেরত পাঠানোর ডেলিভারি চার্জ কাস্টমারকে দিতে হবে।",storeAbout:"Your new destination for electronics, accessories and gaming gear.",shopTitle:"Shop",shopLinks:"All Products | products.html\nGaming | products.html?cat=Gaming\nAudio | products.html?cat=Headphones",supportTitle:"Customer Care",supportLinks:"Return policy | return-policy.html",contactTitle:"Contact",address:"Online electronics store • Bangladesh\nBangladesh",socialTitle:"Stay connected",socialLinks:"Facebook | #\nInstagram | #",footerNote:"© 2026 ZENVIX."};
STORE_DEFAULTS.logoText="Z";
let storeSettings={...STORE_DEFAULTS};
let productsLoadError=null;
async function loadStoreSettings(){const {data,error}=await supabaseClient.from("zenvix_store_settings").select("settings").eq("id",1).maybeSingle();if(!error&&data?.settings)storeSettings={...STORE_DEFAULTS,...data.settings};applyStoreSettings();return storeSettings}
async function uploadStoreLogo(file){if(!file)return "";if(!["image/png","image/jpeg","image/webp"].includes(file.type))throw new Error("Choose a PNG, JPG, or WebP image.");if(file.size>5*1024*1024)throw new Error("Logo image must be 5 MB or smaller.");const ext={"image/png":"png","image/jpeg":"jpg","image/webp":"webp"}[file.type];const token=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;const path=`store-logos/${token}.${ext}`;const {error}=await supabaseClient.storage.from("product-images").upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;const {data}=supabaseClient.storage.from("product-images").getPublicUrl(path);if(!data?.publicUrl)throw new Error("Could not get a public URL for the uploaded logo.");return data.publicUrl}
async function saveStoreSettings(settings){const next={...STORE_DEFAULTS,...settings};const {error}=await supabaseClient.from("zenvix_store_settings").upsert({id:1,settings:next,updated_at:new Date().toISOString()});if(error)throw error;storeSettings=next;applyStoreSettings()}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function applyStoreSettings(){
 document.title=document.title.replace(/ZENVIX/g,storeSettings.name||STORE_DEFAULTS.name);
 document.querySelectorAll(".tl-logo").forEach(el=>{const url=String(storeSettings.logoUrl||"").trim();el.replaceChildren();if(url){el.classList.add("has-image");const image=document.createElement("img");image.src=url;image.alt=(storeSettings.name||"Store")+" logo";image.loading="eager";el.appendChild(image)}else{el.classList.remove("has-image");el.textContent=storeSettings.logoText||"Z"}});
 document.querySelectorAll(".brand-text").forEach(el=>{const name=String(storeSettings.name||STORE_DEFAULTS.name).trim();const match=name.match(/^(.*?)\s+Store$/i);const nameNode=el.querySelector(".brand-name");const storeNode=el.querySelector("b");const taglineNode=el.querySelector("small");if(nameNode)nameNode.textContent=match?match[1]:name;if(storeNode){storeNode.textContent=match?"Store":"";storeNode.hidden=!match}if(taglineNode)taglineNode.textContent=storeSettings.tagline||""});
 const strip=document.querySelector(".top-strip");if(strip)strip.textContent=storeSettings.topMessage||"";
 const hero=document.querySelector(".hero h1");if(hero)hero.textContent=storeSettings.heroTitle||"";
 const heroText=document.querySelector(".hero-grid > div > p");if(heroText)heroText.textContent=storeSettings.heroText||"";
 const deals=document.querySelector(".deals");if(deals)deals.hidden=storeSettings.promoEnabled===false;
 const promoLabel=document.querySelector(".deals .section-title small");if(promoLabel)promoLabel.textContent=storeSettings.promoLabel||"";
 const promoTitle=document.querySelector(".deals .section-title h2");if(promoTitle)promoTitle.textContent=storeSettings.promoTitle||"";
const footer=document.querySelector(".footer-grid");if(footer){const cols=footer.children;const brand=cols[0];if(brand?.querySelector("p"))brand.querySelector("p").textContent=storeSettings.storeAbout||"";if(cols[1]){cols[1].querySelector("h4").textContent=storeSettings.shopTitle||"Shop";setFooterLinks(cols[1],storeSettings.shopLinks)}if(cols[2]){cols[2].querySelector("h4").textContent=storeSettings.supportTitle||"Customer Care";setFooterLinks(cols[2],"");let details=cols[2].querySelector(":scope > .footer-contact");if(!details){details=document.createElement("div");details.className="footer-contact";cols[2].appendChild(details)}details.replaceChildren();if(storeSettings.email){const email=document.createElement("a");email.href="mailto:"+storeSettings.email;email.textContent=storeSettings.email;details.appendChild(email)}if(storeSettings.phone){const phone=document.createElement("a");phone.href="tel:"+storeSettings.phone.replace(/[^+\d]/g,"");phone.textContent=storeSettings.phone;details.appendChild(phone)}const policy=document.createElement("a");policy.href="return-policy.html";policy.textContent="Return policy";details.appendChild(policy)}if(cols[3]){cols[3].querySelector("h4").textContent=storeSettings.socialTitle||"Stay connected";setFooterLinks(cols[3],storeSettings.socialLinks||"")}}
 const copy=document.querySelector(".copyright");if(copy)copy.textContent=storeSettings.footerNote||`© ${new Date().getFullYear()} ${storeSettings.name}.`;
}
function withWorkingReturnPolicy(raw){let found=false;const rows=String(raw||"").split("\n").filter(Boolean).map(row=>{const parts=row.split("|");if((parts[0]||"").trim().toLowerCase()==="return policy"){found=true;return "Return policy | return-policy.html"}return row});if(!found)rows.push("Return policy | return-policy.html");return rows.join("\n")}function setFooterLinks(column,raw){column.querySelectorAll(":scope > a").forEach(link=>link.remove());const holder=column.querySelector(":scope > .footer-links")||document.createElement("div");holder.className="footer-links";holder.innerHTML=String(raw||"").split("\n").filter(Boolean).map(row=>{const [label,url]=row.split("|").map(x=>x.trim());const safe=/^(https?:|mailto:|tel:|#|\/)/i.test(url||"")?url:"#";return `<a href="${escapeHtml(safe)}">${escapeHtml(label||"")}</a>`}).join("");if(!holder.parentNode)column.appendChild(holder)}
loadStoreSettings();
const seedProducts=[
{id:1,name:"Joyroom JR-PBF05 65W 30000mAh Power Bank",cat:"Power Bank",price:4650,old:5400,stock:41,rating:4.8,img:IMG.power,brand:"JOYROOM",badge:"14% OFF",desc:"30000mAh capacity with up to 65W USB-C power delivery. Demo catalog data based on a current Bangladesh product listing."},
{id:2,name:"Havit H655BT ANC Bluetooth Headphone",cat:"Headphones",price:3500,old:3850,stock:18,rating:4.9,img:IMG.head,brand:"Havit",badge:"HOT",desc:"Bluetooth 5.3, hybrid ANC, 700mAh battery and up to 76 hours playback according to the listed specifications."},
{id:3,name:"Havit HV-MS1027 USB Gaming Mouse",cat:"Gaming",price:530,old:580,stock:30,rating:4.7,img:IMG.mouse,brand:"Havit",badge:"BEST VALUE",desc:"Wired gaming mouse with adjustable DPI, ergonomic shape and breathing-light design."},
{id:4,name:"T-WOLF T18 RGB Mechanical Gaming Keyboard",cat:"Keyboard",price:1950,old:2145,stock:14,rating:4.7,img:"https://placehold.co/900x700/f4f5f7/17202a?text=T-WOLF+T18+RGB",brand:"T-WOLF",badge:"GAMING",desc:"87-key wired mechanical keyboard with blue switches and RGB lighting."},
{id:5,name:"AKAI BTE-J500BT Earbuds + Speaker",cat:"Headphones",price:2290,old:2590,stock:10,rating:4.5,img:IMG.ear,brand:"AKAI",badge:"2-IN-1",desc:"True wireless earbuds with a portable speaker-style charging case. Replace demo price with your supplier price before launch."},
{id:6,name:"Baseus-style 20W USB-C Charger",cat:"Chargers",price:990,old:1190,stock:22,rating:4.6,img:"https://placehold.co/900x700/f4f5f7/17202a?text=20W+USB-C+Charger",brand:"Sarkar Select",badge:"DEAL",desc:"Compact USB-C charging adapter. Use your exact model specifications before publishing."},
{id:7,name:"RGB Gaming Mouse Pad XL",cat:"Gaming",price:790,old:990,stock:20,rating:4.6,img:"https://placehold.co/900x700/f4f5f7/17202a?text=RGB+Gaming+Mouse+Pad",brand:"Sarkar Select",badge:"GAMING",desc:"Large desk mat for keyboard and mouse setups."},
{id:8,name:"20,000mAh Fast Power Bank",cat:"Power Bank",price:1790,old:2190,stock:25,rating:4.5,img:"https://placehold.co/900x700/f4f5f7/17202a?text=20%2C000mAh+Power+Bank",brand:"Sarkar Select",badge:"DEAL",desc:"Everyday high-capacity power bank. Replace demo specs with your actual inventory."}
];

function money(n){return "৳"+Number(n).toLocaleString("en-BD")}
function customerAccountUrl(next=""){const url=new URL("account.html",location.href);if(next==="checkout.html")url.searchParams.set("next",next);return url.href}
function checkoutOrLogin(){supabaseClient.auth.getUser().then(({data:{user}})=>{location.href=user?"checkout.html":customerAccountUrl("checkout.html")})}
function safeNext(){return new URLSearchParams(location.search).get("next")==="checkout.html"?"checkout.html":""}
async function initAccount(){
  const root=document.getElementById("account");if(!root)return;
  const next=safeNext();const {data:{user}}=await supabaseClient.auth.getUser();
  if(user){if(next){location.replace("checkout.html");return}await renderCustomerAccount(root,user);return}
  root.innerHTML=`<section class="account-card"><h1>Your account</h1><p>Sign in or create an account to place orders and view your order history.</p><div class="account-switch"><button class="active" type="button" data-account-form="login">Sign in</button><button type="button" data-account-form="signup">Create account</button></div><form id="customerLogin" class="account-form"><label>Email address<input type="email" name="email" autocomplete="email" required></label><label>Password<input type="password" name="password" autocomplete="current-password" required></label><button class="btn orange" type="submit">Sign in</button><p class="account-message" id="loginMessage" role="status"></p></form><form id="customerSignup" class="account-form hidden"><label>Your name<input name="name" autocomplete="name" required></label><label>Email address<input type="email" name="email" autocomplete="email" required></label><label>Password <small>(at least 10 characters)</small><input type="password" name="password" minlength="10" autocomplete="new-password" required></label><button class="btn orange" type="submit">Create account</button><p class="account-message" id="signupMessage" role="status"></p></form></section>`;
  document.querySelectorAll("[data-account-form]").forEach(button=>button.onclick=()=>{document.querySelectorAll("[data-account-form]").forEach(b=>b.classList.toggle("active",b===button));document.getElementById("customerLogin").classList.toggle("hidden",button.dataset.accountForm!=="login");document.getElementById("customerSignup").classList.toggle("hidden",button.dataset.accountForm!=="signup")});
  document.getElementById("customerLogin").onsubmit=async event=>{event.preventDefault();const f=new FormData(event.currentTarget);const msg=document.getElementById("loginMessage");msg.textContent="Signing in…";const {error}=await supabaseClient.auth.signInWithPassword({email:String(f.get("email")).trim(),password:String(f.get("password"))});if(error){msg.textContent="Sign-in failed. Check your email and password.";return}if(next)location.replace("checkout.html");else location.reload()};
  document.getElementById("customerSignup").onsubmit=async event=>{event.preventDefault();const f=new FormData(event.currentTarget);const msg=document.getElementById("signupMessage");const email=String(f.get("email")||"").trim().toLowerCase();const redirect=new URL("account.html",location.href);if(next)redirect.searchParams.set("next",next);msg.textContent="Creating your account…";const {data,error}=await supabaseClient.auth.signUp({email,password:String(f.get("password")),options:{data:{full_name:String(f.get("name")||"").trim()},emailRedirectTo:redirect.href}});if(error){msg.textContent="Could not create account. Check the details and try again.";return}if(data.session){if(next)location.replace("checkout.html");else location.reload()}else{msg.textContent="Check your email to confirm your account, then sign in to continue."}};
}
async function renderCustomerAccount(root,user){
  const {data:rows,error}=await supabaseClient.from("zenvix_orders").select("order_number,order_data,status,created_at").eq("user_id",user.id).order("created_at",{ascending:false});
  root.innerHTML=`<section class="account-card account-dashboard"><div class="account-heading"><div><small>MY ACCOUNT</small><h1>Welcome${user.user_metadata?.full_name?", "+escapeHtml(user.user_metadata.full_name):""}</h1><p>${escapeHtml(user.email||"")}</p></div><button id="customerSignOut" class="btn light-btn" type="button">Sign out</button></div><h2>My orders</h2>${error?`<p class="account-message">Could not load orders. Please refresh.</p>`:rows?.length?`<div class="account-orders">${rows.map(row=>{const order=row.order_data||{};return `<article class="account-order"><div><b>${escapeHtml(row.order_number)}</b><small>${escapeHtml(order.date||row.created_at||"")}</small></div><span>${escapeHtml(row.status||"Pending")}</span><strong>${money(Number(order.total)||0)}</strong></article>`}).join("")}</div>`:`<div class="empty"><p>You haven't placed any orders yet.</p><a class="btn orange" href="products.html">Browse products</a></div>`}</section>`;
  document.getElementById("customerSignOut").onclick=async()=>{await supabaseClient.auth.signOut();location.href="index.html"};
}
async function getProducts(){
  const { data, error } = await supabaseClient
    .from("products")
    .select(`
      *,
      product_images (
        url,
        sort_order
      )
    `)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if(error){
    console.error("Supabase products error:", error);
    productsLoadError=error;
    return [];
  }
  productsLoadError=null;

  const products = (data || []).map(p => ({
    ...p,
    id: String(p.id),
    cat: p.category || p.cat || "Other",
    category: p.category || p.cat || "Other",
    price: Number(p.price) || 0,
    old: Number(p.compare_at_price ?? p.old_price ?? p.price) || 0,
    stock: Number(p.stock ?? p.stock_quantity ?? p.quantity) || 0,
    images: (p.product_images || [])
      .slice()
      .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
      .map(image => image.url)
      .filter(Boolean),
    img: p.product_images?.slice()?.sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))?.[0]?.url || p.image_url || p.img || "",
    badge: p.badge || "",
    rating: Number(p.rating) || 5,
    desc: p.description || p.desc || "",
    specifications: p.specifications || ""
  }));

  console.log("Supabase products:", products);
  return products;
}function saveProducts(p){localStorage.setItem("se_products",JSON.stringify(p))}
function getCart(){return JSON.parse(localStorage.getItem("se_cart")||"[]")}
function saveCart(c){localStorage.setItem("se_cart",JSON.stringify(c));updateCartCount()}
// Orders and delivery settings use Supabase so customers/admins share the same data.
function getLocalOrders(){try{return JSON.parse(localStorage.getItem("se_orders")||"[]")}catch{return []}}
async function getOrders(){
  const {data,error}=await supabaseClient.from("zenvix_orders").select("order_number,order_data,status,created_at,archived_at").order("created_at",{ascending:false});
  if(error){console.error("Load orders failed:",error);return getLocalOrders();}
  return (data||[]).map(row=>({...row.order_data,id:row.order_number,status:row.status||row.order_data?.status||"Pending",date:row.order_data?.date||row.created_at,archivedAt:row.archived_at||null}));
}
async function saveOrder(order){
  const {error}=await supabaseClient.from("zenvix_orders").insert({order_number:order.id,user_id:order.user_id,order_data:order,status:order.status||"Pending"});
  if(error){console.error("Save order failed:",error);throw error;}
}
async function saveOrderStatus(id,status){
  const {error}=await supabaseClient.from("zenvix_orders").update({status}).eq("order_number",id);
  if(error){console.error("Update order status failed:",error);throw error;}
}
async function saveOrderArchive(id,archived){
  const {error}=await supabaseClient.from("zenvix_orders").update({archived_at:archived?new Date().toISOString():null}).eq("order_number",id);
  if(error){console.error("Archive order failed:",error);throw error;}
}
function updateCartCount(){document.querySelectorAll("#cartCount").forEach(e=>e.textContent=getCart().reduce((s,x)=>s+x.qty,0))}
function addToCart(id,qty=1){
  id = String(id);
  qty = Math.max(1, Number(qty) || 1);
  let c=getCart(),x=c.find(i=>String(i.id)===id);
  x ? x.qty+=qty : c.push({id,qty});
  saveCart(c);
  showToast("Added to cart ✓");
}

function buyNow(id, qty=1){
  id = String(id);
  qty = Math.max(1, Number(qty) || 1);
  // Keep the selected item while requiring a customer account before checkout.
  saveCart([{id, qty}]);
  checkoutOrLogin();
}
function showToast(msg){let t=document.createElement("div");t.textContent=msg;t.style.cssText="position:fixed;right:20px;bottom:20px;background:#0d1b2a;color:#fff;padding:13px 17px;border-radius:10px;z-index:99;box-shadow:0 10px 30px #0003;font-weight:800;font-size:13px";document.body.appendChild(t);setTimeout(()=>t.remove(),1700)}
function card(p){
  const id = encodeURIComponent(String(p.id));
  const name = String(p.name || "Product").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const img = p.img || "https://placehold.co/900x700/f4f5f7/17202a?text=Product+Image";
  const brand = p.brand || "";
  const cat = p.cat || p.category || "Other";
  return `<article class="product-card">
    <a href="product.html?id=${id}"><div class="product-image"><span class="sale-badge">${p.badge || ""}</span><img src="${img}" alt="${name}" onerror="this.src='https://placehold.co/900x700/f4f5f7/17202a?text=Product+Image'"></div></a>
    <div class="product-body"><small>${brand} • ${cat}</small><h3><a class="product-title-link" href="product.html?id=${id}">${name}</a></h3>
    <div class="rating">★★★★★ <span>(${p.rating || 5})</span></div>
    <div><span class="price">${money(p.price)}</span>${p.old > p.price ? `<span class="old">${money(p.old)}</span>` : ""}</div>
    <div class="product-actions"><button class="buy-now" onclick="buyNow('${String(p.id).replace(/'/g, "\\'")}')">Buy Now</button><button class="add" onclick="addToCart('${String(p.id).replace(/'/g, "\\'")}')">Add to cart</button></div></div></article>`;
}
function getProductCategories(products){const seen=new Set();return products.map(product=>String(product.category||product.cat||"Other").trim()).filter(category=>{const key=category.toLocaleLowerCase();if(!category||seen.has(key))return false;seen.add(key);return true})}
function categoryIcon(category){const value=category.toLocaleLowerCase();if(/power|battery|bank/.test(value))return "🔋";if(/audio|headphone|earbud/.test(value))return "🎧";if(/gaming|game/.test(value))return "🎮";if(/speaker/.test(value))return "🔊";if(/keyboard|mouse/.test(value))return "⌨️";if(/charg|cable|adapter/.test(value))return "🔌";if(/cloth|hood|shirt|fashion|apparel/.test(value))return "👕";if(/computer|case|pc/.test(value))return "🖥️";return "📦"}
function renderHomepageCategories(products){
  const categories=getProductCategories(products);
  const nav=document.getElementById("categoryNavLinks");
  if(nav)nav.innerHTML=`<a href="products.html">All Products</a>${categories.map(category=>`<a href="products.html?cat=${encodeURIComponent(category)}">${escapeHtml(category)}</a>`).join("")}`;
  const cards=document.getElementById("categoryCards");
  if(cards)cards.innerHTML=categories.map(category=>{const count=products.filter(product=>String(product.category||product.cat||"Other").trim().toLocaleLowerCase()===category.toLocaleLowerCase()).length;return `<a href="products.html?cat=${encodeURIComponent(category)}"><i>${categoryIcon(category)}</i><b>${escapeHtml(category)}</b><span>${count} ${count===1?"product":"products"}</span></a>`}).join("");
}
async function renderFeatured(){const products=await getProducts();renderHomepageCategories(products);document.getElementById("featuredGrid").innerHTML=products.slice(0,4).map(card).join("");updateCartCount()}
function homeSearch(){let q=document.getElementById("homeSearch").value.trim();location.href="products.html"+(q?"?q="+encodeURIComponent(q):"")}
async function initShop(){
  const params = new URLSearchParams(location.search);
  const requestedCategory = params.get("cat") || "all";
  const initialQuery = params.get("q") || "";
  const search = document.getElementById("search");
  const grid = document.getElementById("productGrid");
  const shopTitle = document.getElementById("shopTitle");
  const filterRoot=document.getElementById("categoryFilters");
  if (!search || !grid) return;
  search.value = initialQuery;

  grid.innerHTML = '<div class="empty">Loading products…</div>';
  const products = await getProducts();
  const categories=getProductCategories(products);
  if(filterRoot)filterRoot.innerHTML=`<b>Categories</b><button data-cat="all">All</button>${categories.map(category=>`<button data-cat="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}`;
  const filterButtons = [...document.querySelectorAll(".filters button")];
  let active = filterButtons.find(button => button.dataset.cat.toLowerCase() === requestedCategory.toLowerCase())?.dataset.cat || "all";

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.cat === active);
    button.onclick = () => {
      active = button.dataset.cat || "all";
      document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      updateShopTitle();
      draw();
    };
  });

  function updateShopTitle(){
    if (shopTitle) {
      const selected = filterButtons.find(button => button.dataset.cat === active);
      shopTitle.textContent = active === "all" ? "All products" : (selected?.textContent.trim() || active);
    }
  }
  updateShopTitle();

  const sortSelect = document.getElementById("sort");
  if (sortSelect) sortSelect.onchange = draw;
  search.oninput = draw;

  function draw(){
    const keyword = search.value.trim().toLowerCase();
    const list = products.filter(product => {
      const category = String(product.category || product.cat || "Other");
      const name = String(product.name || "").toLowerCase();
      const brand = String(product.brand || "").toLowerCase();

      const categoryMatch = active === "all" || category.toLowerCase() === active.toLowerCase();

      const searchMatch = !keyword || name.includes(keyword) ||
        category.toLowerCase().includes(keyword) || brand.includes(keyword);

      return categoryMatch && searchMatch;
    });

    const sort = sortSelect?.value || "featured";
    if (sort === "low") list.sort((a,b) => a.price - b.price);
    if (sort === "high") list.sort((a,b) => b.price - a.price);

    grid.innerHTML = list.length
      ? list.map(card).join("")
      : '<div class="empty">No products found in this category.</div>';
  }

  draw();
  updateCartCount();
}



async function renderDetail(){
  const detail = document.getElementById("detail");
  if (!detail) return;

  const id = new URLSearchParams(location.search).get("id");
  detail.innerHTML = '<div class="empty">Loading product…</div>';

  await loadStoreSettings();
  const products = await getProducts();
  const product = products.find(item => String(item.id) === String(id)) || products[0];

  if (!product) {
    detail.innerHTML = '<div class="empty"><h2>Product not found</h2><a class="btn orange" href="products.html">Back to products</a></div>';
    updateCartCount();
    return;
  }

  const imageList = [...new Set([...(product.images || []), product.img].filter(Boolean))];

  if (!imageList.length) {
    imageList.push("https://placehold.co/900x700/f4f5f7/17202a?text=Product+Image");
  }

  const img = imageList[0];

  detail.innerHTML = `
    <div class="detail-card">
      <div class="detail-gallery">
        <button type="button" class="detail-image" id="mainProductImage" aria-label="Zoom product image">
          <img id="detailMainImg" src="${img}" alt="${product.name || "Product"}" onerror="this.src='https://placehold.co/900x700/f4f5f7/17202a?text=Product+Image'">
          <span class="zoom-hint">⌕ Tap to zoom</span>
        </button>

        ${imageList.length > 1
          ? `<div class="product-thumbnails" id="productThumbnails" aria-label="More product images">
              ${imageList.map((url, index) => `
                <button type="button" class="product-thumb ${index === 0 ? "active" : ""}" data-image-index="${index}" aria-label="View product image ${index + 1}">
                  <img src="${url}" alt="${product.name || "Product"} view ${index + 1}" onerror="this.style.display='none'">
                </button>
              `).join("")}
            </div>`
          : `<p class="gallery-note">Tap the image to zoom</p>`
        }
      </div>

      <div class="detail-info">
        <small>${product.brand || ""} • ${product.cat || product.category || "Other"}</small>

        <h1>${product.name || "Product"}</h1>

        <div class="price">
          ${money(product.price)}
          ${product.old > product.price ? `<span class="old">${money(product.old)}</span>` : ""}
        </div>

        ${product.features ? `<section class="detail-section"><h3>Key Features</h3><ul>${String(product.features).split("\n").filter(line=>line.trim()).map(line=>`<li>${escapeHtml(line.trim())}</li>`).join("")}</ul></section>` : ""}
        <div class="cash-price-option"><input type="radio" name="detailPayment" checked disabled aria-label="Cash Discount Price"><span><b>Cash Discount Price</b><small>Pay the discounted price</small></span><span class="cash-price-values"><strong>${money(product.price)}</strong>${product.old > product.price ? `<del>${money(product.old)}</del><em>${Math.round((1-product.price/product.old)*100)}% OFF</em>` : ""}</span></div>

        <p class="stock-line"><b>Stock:</b> ${Number(product.stock)||0} units • <b>Delivery:</b> Nationwide</p>
        <div class="purchase-panel">
          <div class="qty"><b>Quantity</b><button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button><input id="qty" type="number" min="1" max="${Math.max(1, Number(product.stock)||1)}" value="1" ${Number(product.stock)<=0?"disabled":""}><button type="button" id="qtyPlus" aria-label="Increase quantity">+</button></div>
          <div class="purchase-total"><span>Product total</span><b id="detailSubtotal">${money(product.price)}</b></div>
          <p class="purchase-note">Delivery charge is calculated at checkout.</p>
          <div class="purchase-actions">
            <button class="btn orange" id="detailBuyNow" ${Number(product.stock)<=0?"disabled":""}>Buy Now · ${money(product.price)}</button>
            <button class="btn ghost" id="detailAddToCart" ${Number(product.stock)<=0?"disabled":""}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
    <div class="product-detail-tabs"><div class="detail-tab-buttons"><button class="active" type="button" data-detail-tab="specification">Specification</button><button type="button" data-detail-tab="description">Description</button><button type="button" data-detail-tab="delivery">Delivery</button></div>
      <section class="detail-tab-panel" id="detailTabSpecification"><h2>Specification</h2>${product.specifications?`<ul>${String(product.specifications).split("\n").filter(line=>line.trim()).map(line=>`<li>${escapeHtml(line.trim())}</li>`).join("")}</ul>`:`<p>No specifications added yet.</p>`}</section>
      <section class="detail-tab-panel hidden" id="detailTabDescription"><h2>Description</h2><p>${escapeHtml(product.desc||product.description||"Product details will be added soon.")}</p></section>
      <section class="detail-tab-panel hidden" id="detailTabDelivery"><h2>Delivery & Returns</h2><p>${escapeHtml(storeSettings.deliveryInfo||STORE_DEFAULTS.deliveryInfo).replace(/\n/g,"<br>")}</p></section>
    </div>

    <div class="image-zoom-modal" id="imageZoomModal" aria-hidden="true">
      <button type="button" class="zoom-close" id="zoomClose" aria-label="Close image">×</button>
      <button type="button" class="zoom-nav zoom-prev" id="zoomPrev" aria-label="Previous image">‹</button>

      <div class="zoom-stage" id="zoomStage">
        <img id="zoomImage" src="${img}" alt="${product.name || "Product"} enlarged">
      </div>

      <button type="button" class="zoom-nav zoom-next" id="zoomNext" aria-label="Next image">›</button>

      <div class="zoom-controls">
        <button type="button" id="zoomOut" aria-label="Zoom out">−</button>
        <span id="zoomLevel">100%</span>
        <button type="button" id="zoomIn" aria-label="Zoom in">+</button>
      </div>

      <p class="zoom-caption">Use +/− to zoom • Swipe to change image</p>
    </div>
  `;

  document.querySelectorAll("[data-detail-tab]").forEach(button=>button.onclick=()=>{document.querySelectorAll("[data-detail-tab]").forEach(b=>b.classList.toggle("active",b===button));document.getElementById("detailTabSpecification").classList.toggle("hidden",button.dataset.detailTab!=="specification");document.getElementById("detailTabDescription").classList.toggle("hidden",button.dataset.detailTab!=="description");document.getElementById("detailTabDelivery").classList.toggle("hidden",button.dataset.detailTab!=="delivery")});
  const mainImg = document.getElementById("detailMainImg");
  const zoomModal = document.getElementById("imageZoomModal");
  const zoomImg = document.getElementById("zoomImage");

  let activeImageIndex = 0;
  let zoomScale = 1;
  let panX = 0;
  let panY = 0;
  const zoomStage = document.getElementById("zoomStage");
  const zoomPointers = new Map();
  let dragStart = null;
  let pinchStart = null;
  let swipeStart = null;

  const clampPan = () => {
    const stageRect = zoomStage.getBoundingClientRect();
    const naturalWidth = zoomImg.naturalWidth || stageRect.width;
    const naturalHeight = zoomImg.naturalHeight || stageRect.height;
    const fit = Math.min(stageRect.width / naturalWidth, stageRect.height / naturalHeight);
    const maxX = Math.max(0, (naturalWidth * fit * zoomScale - stageRect.width) / 2);
    const maxY = Math.max(0, (naturalHeight * fit * zoomScale - stageRect.height) / 2);
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
  };

  const applyZoomTransform = () => {
    clampPan();
    zoomImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomScale})`;
    document.getElementById("zoomLevel").textContent = `${Math.round(zoomScale * 100)}%`;
    zoomStage.classList.toggle("zoomed", zoomScale > 1);
  };

  const pointerDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const pointerMidpoint = (a, b) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});

  const setProductImage = (index) => {
    activeImageIndex = (index + imageList.length) % imageList.length;

    mainImg.src = imageList[activeImageIndex];
    zoomImg.src = imageList[activeImageIndex];

    document.querySelectorAll(".product-thumb").forEach((button, i) => {
      button.classList.toggle("active", i === activeImageIndex);
    });

    zoomScale = 1;
    panX = 0;
    panY = 0;
    applyZoomTransform();
  };

  document.querySelectorAll(".product-thumb").forEach(button => {
    button.addEventListener("click", () => {
      setProductImage(Number(button.dataset.imageIndex));
    });
  });

  const closeZoom = () => {
    zoomModal.classList.remove("open");
    zoomModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("zoom-open");
  };

  document.getElementById("mainProductImage").addEventListener("click", () => {
    setProductImage(activeImageIndex);
    zoomModal.classList.add("open");
    zoomModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("zoom-open");
  });

  document.getElementById("zoomClose").addEventListener("click", closeZoom);

  zoomModal.addEventListener("click", event => {
    if (event.target === zoomModal) closeZoom();
  });

  document.getElementById("zoomPrev").addEventListener("click", () => {
    setProductImage(activeImageIndex - 1);
  });

  document.getElementById("zoomNext").addEventListener("click", () => {
    setProductImage(activeImageIndex + 1);
  });

  const applyZoom = (delta) => {
    zoomScale = Math.max(1, Math.min(4, zoomScale + delta));
    if (zoomScale === 1) { panX = 0; panY = 0; }
    applyZoomTransform();
  };

  document.getElementById("zoomIn").addEventListener("click", () => applyZoom(0.25));
  document.getElementById("zoomOut").addEventListener("click", () => applyZoom(-0.25));

  zoomStage.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    zoomStage.setPointerCapture(event.pointerId);
    zoomPointers.set(event.pointerId, {x:event.clientX,y:event.clientY});
    if (zoomPointers.size === 1) {
      dragStart = {x:event.clientX,y:event.clientY,panX,panY};
      swipeStart = {x:event.clientX,y:event.clientY,zoomed:zoomScale>1};
    } else if (zoomPointers.size === 2) {
      const [a,b] = [...zoomPointers.values()];
      const midpoint = pointerMidpoint(a,b);
      pinchStart = {distance:pointerDistance(a,b),scale:zoomScale,panX,panY,midpoint};
      dragStart = null;
      swipeStart = null;
    }
  });

  zoomStage.addEventListener("pointermove", event => {
    if (!zoomPointers.has(event.pointerId)) return;
    event.preventDefault();
    zoomPointers.set(event.pointerId, {x:event.clientX,y:event.clientY});
    if (zoomPointers.size >= 2 && pinchStart) {
      const [a,b] = [...zoomPointers.values()];
      const midpoint = pointerMidpoint(a,b);
      const rect = zoomStage.getBoundingClientRect();
      const ratio = pointerDistance(a,b) / Math.max(1,pinchStart.distance);
      zoomScale = Math.max(1,Math.min(4,pinchStart.scale*ratio));
      const localX = (pinchStart.midpoint.x - rect.left - rect.width/2 - pinchStart.panX) / pinchStart.scale;
      const localY = (pinchStart.midpoint.y - rect.top - rect.height/2 - pinchStart.panY) / pinchStart.scale;
      panX = midpoint.x - rect.left - rect.width/2 - localX*zoomScale;
      panY = midpoint.y - rect.top - rect.height/2 - localY*zoomScale;
      if (zoomScale === 1) { panX=0; panY=0; }
      applyZoomTransform();
    } else if (zoomPointers.size === 1 && zoomScale > 1 && dragStart) {
      panX = dragStart.panX + event.clientX - dragStart.x;
      panY = dragStart.panY + event.clientY - dragStart.y;
      applyZoomTransform();
    }
  });

  const finishZoomPointer = event => {
    const wasSinglePointer = zoomPointers.size === 1;
    const start = swipeStart;
    const endX = event.clientX;
    zoomPointers.delete(event.pointerId);
    if (wasSinglePointer && start && !start.zoomed && zoomScale === 1 && Math.abs(endX-start.x)>55) {
      setProductImage(activeImageIndex + (endX < start.x ? 1 : -1));
    }
    if (zoomPointers.size >= 2) {
      const [a,b] = [...zoomPointers.values()];
      const midpoint=pointerMidpoint(a,b);
      pinchStart={distance:pointerDistance(a,b),scale:zoomScale,panX,panY,midpoint};
    } else {
      pinchStart=null;
      const remaining=[...zoomPointers.values()][0];
      dragStart=remaining?{x:remaining.x,y:remaining.y,panX,panY}:null;
      swipeStart=remaining?{x:remaining.x,y:remaining.y,zoomed:zoomScale>1}:null;
    }
  };
  zoomStage.addEventListener("pointerup", finishZoomPointer);
  zoomStage.addEventListener("pointercancel", finishZoomPointer);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeZoom();
  });

  const qtyInput=document.getElementById("qty");
  const updatePurchaseTotal=()=>{
    const max=Math.max(1,Number(product.stock)||1);
    const qty=Math.min(max,Math.max(1,Number(qtyInput.value)||1));
    qtyInput.value=qty;
    const total=Number(product.price||0)*qty;
    document.getElementById("detailSubtotal").textContent=money(total);
    document.getElementById("detailBuyNow").textContent=`Buy Now · ${money(total)}`;
  };
  qtyInput.addEventListener("input",updatePurchaseTotal);
  qtyInput.addEventListener("change",updatePurchaseTotal);
  document.getElementById("qtyMinus").onclick=()=>{qtyInput.value=Math.max(1,(Number(qtyInput.value)||1)-1);updatePurchaseTotal()};
  document.getElementById("qtyPlus").onclick=()=>{qtyInput.value=Math.min(Math.max(1,Number(product.stock)||1),(Number(qtyInput.value)||1)+1);updatePurchaseTotal()};
  document.getElementById("detailAddToCart").onclick = () => addToCart(product.id,Number(qtyInput.value)||1);
  document.getElementById("detailBuyNow").onclick = () => buyNow(product.id,Number(qtyInput.value)||1);
  updatePurchaseTotal();

  updateCartCount();
}

function getCartProducts(cart, products){
  return cart.map(item => {
    const product = products.find(p => String(p.id) === String(item.id));
    return product ? {...product, qty: Math.max(1, Number(item.qty) || 1)} : null;
  }).filter(Boolean);
}

const DELIVERY_SETTINGS_KEY = "zenvix_delivery_settings";
const DEFAULT_DELIVERY_SETTINGS = {
  courier: "Other",
  originDistrict: "Rajshahi",
  originArea: "",
  sameDistrict: 90,
  dhakaCity: 100,
  otherDistrict: 150,
  areaOverrides: ""
};
let deliverySettingsCache = null;
async function getDeliverySettings(){
  if(deliverySettingsCache) return {...DEFAULT_DELIVERY_SETTINGS,...deliverySettingsCache};
  const {data,error}=await supabaseClient.from("zenvix_delivery_settings").select("settings").eq("id",1).maybeSingle();
  if(error){console.error("Load delivery settings failed:",error);try{deliverySettingsCache=JSON.parse(localStorage.getItem(DELIVERY_SETTINGS_KEY)||"{}")}catch{deliverySettingsCache={}}}
  else deliverySettingsCache=data?.settings||{};
  return {...DEFAULT_DELIVERY_SETTINGS,...deliverySettingsCache};
}
async function saveDeliverySettings(settings){
  const {error}=await supabaseClient.from("zenvix_delivery_settings").upsert({id:1,settings,updated_at:new Date().toISOString()});
  if(error) throw error;
  deliverySettingsCache=settings;
  localStorage.setItem(DELIVERY_SETTINGS_KEY,JSON.stringify(settings));
}
function normalizePlace(value){
  return String(value || "").trim().toLocaleLowerCase().replace(/\\s+/g, " ");
}
function calculateDeliveryCharge(district, area, settings = {...DEFAULT_DELIVERY_SETTINGS,...(deliverySettingsCache||{})}){
  const destinationDistrict = normalizePlace(district);
  const destinationArea = normalizePlace(area);
  // Optional exact-area overrides: one rule per line, format District | Area | Charge.
  const rules = String(settings.areaOverrides || "").split(/\\r?\\n/).map(line => {
    const parts = line.split("|").map(part => part.trim());
    return parts.length >= 3 && parts[0] && parts[1] && Number.isFinite(Number(parts[2]))
      ? {district: normalizePlace(parts[0]), area: normalizePlace(parts[1]), charge: Math.max(0, Number(parts[2]))}
      : null;
  }).filter(Boolean);
  const override = rules.find(rule => rule.district === destinationDistrict && rule.area === destinationArea);
  if (override) return {charge: override.charge, rule: "Area-specific rate"};
  if (destinationDistrict === "dhaka" || destinationDistrict === "dhaka city") {
    return {charge: Math.max(0, Number(settings.dhakaCity) || 0), rule: "Dhaka city"};
  }
  if (destinationDistrict && destinationDistrict === normalizePlace(settings.originDistrict)) {
    return {charge: Math.max(0, Number(settings.sameDistrict) || 0), rule: "Same district / local"};
  }
  return {charge: Math.max(0, Number(settings.otherDistrict) || 0), rule: "Other district"};
}
function calculateCartTotals(cartProducts, district = "", area = ""){
  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal ? calculateDeliveryCharge(district, area).charge : 0;
  return {sub: subtotal, delivery, total: subtotal + delivery};
}

async function renderCart(){
  const el = document.getElementById("cart");
  if (!el) return;
  const cart = getCart();
  if (!cart.length) {
    el.innerHTML = '<div class="empty"><h2>Your shopping cart is empty</h2><p>Find something useful for your setup.</p><a class="btn orange" href="products.html">Continue shopping</a></div>';
    updateCartCount();
    return;
  }
  el.innerHTML = '<div class="empty">Loading your cart…</div>';
  const products = await getProducts();
  const items = getCartProducts(cart, products);
  if (!items.length) {
    el.innerHTML = '<div class="empty"><h2>Your cart is empty</h2><p>The saved products may no longer be available.</p><a class="btn orange" href="products.html">Continue shopping</a></div>';
    localStorage.removeItem("se_cart");
    updateCartCount();
    return;
  }
  const totals = calculateCartTotals(items);
  el.innerHTML = `<div class="cart-layout"><div class="cart-box">${items.map(item => `<div class="cart-row">
    <a class="thumb cart-product-link" href="product.html?id=${encodeURIComponent(String(item.id))}" aria-label="View ${item.name} details"><img src="${item.img || "https://placehold.co/200x150?text=Image"}" alt="${item.name || "Product"}" onerror="this.src='https://placehold.co/200x150?text=Image'"></a>
    <div><h3><a class="product-title-link" href="product.html?id=${encodeURIComponent(String(item.id))}">${item.name}</a></h3><small>${money(item.price)} each</small></div>
    <div class="qty-controls"><button onclick="changeQty('${String(item.id).replace(/'/g, "\\'")}',-1)">−</button><b>${item.qty}</b><button onclick="changeQty('${String(item.id).replace(/'/g, "\\'")}',1)">+</button></div>
    <b class="row-total">${money(item.price * item.qty)}</b></div>`).join("")}</div>
    <aside class="summary"><h2>Order summary</h2><div class="line"><span>Subtotal</span><b>${money(totals.sub)}</b></div>
    <div class="line"><span>Delivery</span><b>${money(totals.delivery)}</b></div><div class="line total"><span>Total</span><b>${money(totals.total)}</b></div>
    <a class="btn orange full" href="checkout.html">Proceed to checkout</a></aside></div>`;
  updateCartCount();
}

function changeQty(id, delta){
  id = String(id);
  let cart = getCart();
  const item = cart.find(x => String(x.id) === id);
  if (item) {
    item.qty = (Number(item.qty) || 1) + delta;
    if (item.qty <= 0) cart = cart.filter(x => String(x.id) !== id);
  }
  saveCart(cart);
  renderCart();
}

async function renderCheckout(){
  const el = document.getElementById("checkout");
  if (!el) return;
  const cart = getCart();
  if (!cart.length) {
    el.innerHTML = '<div class="empty"><h2>Cart is empty</h2><a class="btn orange" href="products.html">Shop now</a></div>';
    return;
  }
  const {data:{user},error:authError}=await supabaseClient.auth.getUser();
  if(authError||!user){location.replace(customerAccountUrl("checkout.html"));return}
  el.innerHTML = '<div class="empty">Loading checkout…</div>';
  const products = await getProducts();
  const items = getCartProducts(cart, products);
  if (!items.length) {
    el.innerHTML = '<div class="empty"><h2>Cart is empty</h2><a class="btn orange" href="products.html">Shop now</a></div>';
    return;
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const settings = await getDeliverySettings();
  el.innerHTML = `<div class="checkout-layout"><form class="checkout-box" id="orderForm"><h2>Delivery information</h2><p class="account-email-note">Order confirmation will use your signed-in account email.</p>
    <div class="form-grid"><div class="field full-field"><label>Account email</label><input type="email" name="email" value="${escapeHtml(user.email||"")}" readonly required></div><div class="field"><label>Full name</label><input required name="name" value="${escapeHtml(user.user_metadata?.full_name||"")}" placeholder="Your name" autocomplete="name"></div>
    <div class="field"><label>Phone</label><input required name="phone" placeholder="01XXXXXXXXX"></div>
    <div class="field"><label>District</label><input required name="district" placeholder="Rajshahi" autocomplete="address-level1"></div>
    <div class="field"><label>Area / Thana</label><input required name="area" placeholder="Area / thana" autocomplete="address-level2"></div>
    <div class="field full-field"><label>Full address</label><textarea required name="address" placeholder="House, road, area"></textarea></div>
    <div class="field"><label>Payment</label><select name="payment"><option>Cash on Delivery</option><option>bKash (manual)</option><option>Nagad (manual)</option><option>Rocket (manual)</option></select></div>
    <div class="field"><label>Order note</label><input name="note" placeholder="Optional"></div></div>
    <button class="btn orange full" type="submit" id="placeOrderButton">Place order</button></form>
    <aside class="summary"><h2>Review order</h2>${items.map(item => `<div class="line"><span>${item.name} × ${item.qty}</span><b>${money(item.price * item.qty)}</b></div>`).join("")}
    <div class="line"><span>Product total</span><b id="checkoutSubtotal">${money(subtotal)}</b></div>
    <div class="line"><span>Courier</span><b>${String(settings.courier || "Other")}</b></div>
    <div class="line"><span>Delivery charge <small id="deliveryRuleLabel">(select district)</small></span><b id="checkoutDelivery">${money(0)}</b></div>
    <div class="line total"><span>Grand total</span><b id="checkoutTotal">${money(subtotal)}</b></div>
    <p class="muted" style="font-size:12px">Delivery charge is calculated automatically from the district and area you enter.</p></aside></div>`;

  const formEl = document.getElementById("orderForm");
  const updateTotals = () => {
    const district = formEl.elements.district.value;
    const area = formEl.elements.area.value;
    const deliveryInfo = calculateDeliveryCharge(district, area, settings);
    const delivery = subtotal ? deliveryInfo.charge : 0;
    document.getElementById("checkoutDelivery").textContent = money(delivery);
    document.getElementById("checkoutTotal").textContent = money(subtotal + delivery);
    document.getElementById("deliveryRuleLabel").textContent = district.trim() ? `(${deliveryInfo.rule})` : "(select district)";
    document.getElementById("placeOrderButton").textContent = `Place order • ${money(subtotal + delivery)}`;
    return {delivery, deliveryRule: deliveryInfo.rule, total: subtotal + delivery};
  };
  formEl.elements.district.addEventListener("input", updateTotals);
  formEl.elements.area.addEventListener("input", updateTotals);
  updateTotals();

  formEl.onsubmit = async event => {
    event.preventDefault();
    const submitButton=document.getElementById("placeOrderButton");
    submitButton.disabled=true; submitButton.textContent="Saving order…";
    const form = new FormData(event.target);
    const district = String(form.get("district") || "").trim();
    const area = String(form.get("area") || "").trim();
    const totals = updateTotals();
    const order = {
      id: "ZV" + Date.now().toString().slice(-8),
      user_id: user.id,
      date: new Date().toLocaleString(),
      customer: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      phone: String(form.get("phone") || "").trim(),
      district,
      area,
      address: String(form.get("address") || "").trim(),
      payment: form.get("payment"),
      note: form.get("note"),
      courier: settings.courier || "Other",
      items: items.map(item => ({id: item.id, qty: item.qty, name: item.name, price: item.price})),
      subtotal,
      deliveryCharge: totals.delivery,
      deliveryRule: totals.deliveryRule,
      total: totals.total,
      status: "Pending"
    };
    try { await saveOrder(order); }
    catch(error){ submitButton.disabled=false; updateTotals(); showToast("Order save failed. Please try again later."); return; }
    localStorage.removeItem("se_cart");
    el.innerHTML = `<div class="success"><div class="check">✓</div><h2>Order placed successfully!</h2><p>Order ID: <b>${order.id}</b></p><p>Product total: <b>${money(order.subtotal)}</b></p><p>Delivery charge: <b>${money(order.deliveryCharge)}</b> (${order.deliveryRule})</p><p>Grand total: <b>${money(order.total)}</b></p><p>We will contact you at <b>${order.phone}</b> to confirm the order.</p><a class="btn orange" href="index.html">Back to store</a></div>`;
    updateCartCount();
  };
}

async function initAdmin(){
  await loadStoreSettings();
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session){
    document.querySelector(".admin-page").innerHTML=`<section class="summary" style="max-width:520px;margin:40px auto;padding:28px"><h1>Admin sign in</h1><p>Sign in with an admin account created in Supabase Authentication.</p><form id="adminLoginForm" class="admin-form"><input name="email" type="email" placeholder="Admin email" required><input name="password" type="password" placeholder="Password" required><button class="btn orange" type="submit">Sign in</button><p id="adminLoginError" role="alert"></p></form></section>`;
    document.getElementById("adminLoginForm").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const {error}=await supabaseClient.auth.signInWithPassword({email:f.get("email"),password:f.get("password")});if(error){document.getElementById("adminLoginError").textContent="Sign in failed. Check credentials and try again.";return;}location.reload();};
    return;
  }
  const {data:adminRow,error:adminError}=await supabaseClient.from("zenvix_admin_users").select("user_id").eq("user_id",session.user.id).maybeSingle();
  if(adminError||!adminRow){document.querySelector(".admin-page").innerHTML='<div class="empty"><h2>Admin access not enabled</h2><p>This signed-in account does not have admin access.</p><a class="btn orange" href="index.html">Back to store</a></div>';return;}
  const header=document.querySelector(".admin-top");
  if(header){const actions=document.createElement("div");actions.className="admin-top-actions";const archive=document.createElement("button");archive.className="archive-shortcut";archive.type="button";archive.title="Open archived orders";archive.setAttribute("aria-label","Open archived orders");archive.innerHTML='<span aria-hidden="true">▤</span><span>Archive</span>';archive.onclick=openArchivedOrders;const logout=document.createElement("button");logout.className="btn light-btn";logout.textContent="Sign out";logout.onclick=async()=>{await supabaseClient.auth.signOut();location.reload()};actions.append(archive,logout);header.appendChild(actions);}
  await renderAdmin();
  document.querySelectorAll(".admin-tabs button").forEach(button => {
    button.onclick = () => {
      document.querySelectorAll(".admin-tabs button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".admin-tab").forEach(tab => tab.classList.add("hidden"));
      document.getElementById("tab-" + button.dataset.tab)?.classList.remove("hidden");
      if(button.dataset.tab==="orders")showOrderView("active");
    };
  });
}
async function renderAdmin(){
  let p = await getProducts();
  let o = await getOrders();
  const activeOrders = o.filter(x => !x.archivedAt);
  const archivedOrders = o.filter(x => !!x.archivedAt);

  let revenue = activeOrders
    .filter(x => x.status !== "Cancelled")
    .reduce((s, x) => s + x.total, 0);
  const existingCategories=[...new Set(p.map(product=>String(product.category||product.cat||"").trim()).filter(Boolean))]
    .map(category=>`<option value="${escapeHtml(category)}"></option>`).join("");

  document.getElementById("dashboardCards").innerHTML = `
    <div class="dash-card">
      <span>Products</span>
      <b>${productsLoadError ? "Unavailable" : p.length}</b>
    </div>

    <div class="dash-card">
      <span>Orders</span>
      <b>${activeOrders.length}</b>
    </div>

    <div class="dash-card">
      <span>Pending</span>
      <b>${activeOrders.filter(x => x.status === "Pending").length}</b>
    </div>

    <div class="dash-card">
      <span>Order value</span>
      <b>${money(revenue)}</b>
    </div>
  `;

  document.getElementById("tab-overview").innerHTML = `
    <h2>Quick overview</h2>
    ${productsLoadError ? `<p role="alert" style="color:#b42318">Products could not load from Supabase. Check that the product tables and access policies are set up.</p>` : ""}
    <p style="color:#667085">
      Products are loaded from Supabase.
    </p>

    <div class="trust">
      <div class="trust-item">
        <b>Products</b>
        <span>${p.length} catalog items</span>
      </div>

      <div class="trust-item">
        <b>Orders</b>
        <span>${activeOrders.length} active · ${archivedOrders.length} archived</span>
      </div>
    </div>
  `;

  document.getElementById("tab-products").innerHTML = `
    <h2>Product management</h2>
    ${productsLoadError ? `<p role="alert" style="color:#b42318">Products could not load from Supabase. Check the setup SQL and access policies before adding products.</p>` : ""}

    <form class="admin-form" id="productForm"><input type="hidden" name="productId"><h3 id="productFormTitle" class="wide">Add a product</h3>

      <input
        name="name"
        class="wide"
        placeholder="Product name"
        required
      >

      <input
        name="brand"
        placeholder="Brand"
        required
      >

      <input name="cat" list="productCategoryOptions" placeholder="Category (type a new one too)" required>
      <datalist id="productCategoryOptions">${existingCategories}</datalist>

      <input
        name="price"
        type="number"
        placeholder="Price"
        required
      >

      <input
        name="old"
        type="number"
        placeholder="Regular price"
      >

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        required
      >

      
      <input
        name="img"
        class="wide"
        placeholder="Image URL"
      >
      
<label class="wide">Upload Product Images (একাধিক ছবি নির্বাচন করতে পারবে)
  <input type="file" name="images" accept="image/*" multiple>
</label>
<label id="removeImagesLabel" class="wide" hidden><input type="checkbox" name="removeImages"> Remove current product photos</label>


      <input
        name="badge"
        placeholder="Badge (e.g. NEW, HOT, SALE)"
      >

      <select name="featured">
        <option value="false">Regular product</option>
        <option value="true">Featured product</option>
      </select>

      <textarea
        name="description"
        class="wide"
        placeholder="Product description"
        rows="3"
      ></textarea>

            <textarea
        name="specifications"
        class="wide"
        placeholder="Specifications — প্রতি লাইনে একটি তথ্য লিখুন"
        rows="6"
      ></textarea>
      
<label>Product Features (প্রতি লাইনে একটি বৈশিষ্ট্য)</label>
<textarea
  name="features"
  class="wide"
  placeholder="যেমন: Fast Charging&#10;Long Battery Life&#10;Portable Design"
  rows="5"
></textarea>

      <button class="btn orange" type="submit">Add product</button><button class="btn light-btn" type="button" id="cancelProductEdit" hidden>Cancel edit</button>


    </form>

    <div style="overflow:auto">

      <table class="admin-table">

        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          ${
            p.length
              ? p.map(x => `
                <tr>
                  <td>${x.name}</td>
                  <td>${x.cat}</td>
                  <td>${money(x.price)}</td>
                  <td>${x.stock}</td>

                  <td>
                    <button class="mini" onclick="editProduct('${x.id}')">Edit</button><button class="mini danger" onclick="deleteProduct('${x.id}')">Delete</button>
                  </td>

                </tr>
              `).join("")
              : `
                <tr>
                  <td colspan="5">No products found.</td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;

  document.getElementById("cancelProductEdit").onclick=resetProductForm;window.adminProducts=p;
  document.getElementById("productForm").onsubmit = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const name = String(form.get("name") || "").trim();
    const brand = String(form.get("brand") || "").trim();
    const category = String(form.get("cat") || "").trim();
    const price = Number(form.get("price"));
    const compareAtPrice = Number(form.get("old")) || price;
    const stock = Number(form.get("stock")) || 0;
    const imageUrl = String(form.get("img") || "").trim();
    
const badge = String(form.get("badge") || "").trim();
const featured = form.get("featured") === "true";
const description = String(form.get("description") || "").trim();
const specifications = String(form.get("specifications") || "").trim();
const features = String(form.get("features") || "").trim();


    if (!name || !brand || !Number.isFinite(price) || price <= 0) {
      showToast("Please enter a valid name, brand and price.");
      return;
    }

    const button = event.submitter || event.target.querySelector('button[type="submit"],button');
    if (button) { button.disabled = true; button.textContent = "Saving…"; }

    const productId=String(form.get("productId")||"").trim();
    const productData={name,brand,category,price,compare_at_price:compareAtPrice,stock,description:description||null,specifications:specifications||null,features:features||null,featured,active:true};
    let query=supabaseClient.from("products");
    if(productId)query=query.update(productData).eq("id",productId).select("id").single();else query=query.insert([productData]).select("id").single();
    const {data:inserted,error}=await query;

    if (error) {
      console.error("Product insert error:", error);
      showToast("Could not save product. Check Supabase table permissions/schema.");
      if (button) { button.disabled = false; button.textContent = "Add product"; }
      return;
    }

    
const imageFiles = Array.from(form.getAll("images"))
  .filter(file => file instanceof File && file.size > 0);
const removeCurrentImages = form.get("removeImages") === "on";
const replaceImages = Boolean(productId && (imageUrl || imageFiles.length || removeCurrentImages));

// On edit, preserve the current gallery unless the admin changes the photos.
if (replaceImages) {
  const {data: oldImages, error: oldImageReadError}=await supabaseClient.from("product_images").select("url").eq("product_id", inserted.id);
  if (oldImageReadError) {
    console.error("Could not read current product images:", oldImageReadError);
    showToast("Product details saved, but current photos could not be changed.");
    await renderAdmin();
    return;
  }
  const {error: clearImagesError}=await supabaseClient.from("product_images").delete().eq("product_id", inserted.id);
  if (clearImagesError) {
    console.error("Could not replace existing product image records:", clearImagesError);
    showToast("Product details saved, but existing photos could not be updated.");
    await renderAdmin();
    return;
  }
  const oldImagePaths=(oldImages||[]).map(row=>productStoragePath(row.url,inserted.id)).filter(Boolean);
  if(oldImagePaths.length){const {error:removeError}=await supabaseClient.storage.from("product-images").remove(oldImagePaths);if(removeError)console.error("Could not remove old image files:",removeError)}
}

const imageRows = [];

// পুরোনো Image URL থাকলে সেটিও সংরক্ষণ করবে
if (imageUrl) {
  imageRows.push({
    product_id: inserted.id,
    url: imageUrl,
    sort_order: imageRows.length
  });
}

// কম্পিউটার থেকে নির্বাচিত প্রতিটি ছবি আপলোড করবে
for (const file of imageFiles) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${inserted.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseClient
    .storage
    .from("product-images")
    .upload(path, file);

  if (uploadError) {
    console.error("Image upload error:", uploadError);
    showToast("Product saved, but an image upload failed.");
    continue;
  }

  const { data: publicData } = supabaseClient
    .storage
    .from("product-images")
    .getPublicUrl(path);

  if (publicData?.publicUrl) {
    imageRows.push({
      product_id: inserted.id,
      url: publicData.publicUrl,
      sort_order: imageRows.length
    });
  }
}

// সব ছবির URL product_images টেবিলে সেভ করবে
if (imageRows.length > 0 && (!productId || replaceImages)) {
  const { error: imageError } = await supabaseClient
    .from("product_images")
    .insert(imageRows);

  if (imageError) {
    console.error("Product images database error:", imageError);
    showToast("Product saved, but image links could not be saved.");
  }
}


    showToast(productId?"Product updated ✓":"Product added ✓");
    await renderAdmin();
  };

  document.getElementById("tab-orders").innerHTML = `
    <h2>Order management</h2>
    <p>Delivered or cancelled orders can be archived after you no longer need them in the active list. Archiving keeps the order and customer history; you can restore it later.</p>
    <h3>Active orders (${activeOrders.length})</h3>
    <div id="activeOrdersView" style="overflow:auto">

      <table class="admin-table">

        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change</th>
          </tr>
        </thead>

        <tbody>

          ${
            activeOrders.length
              ? activeOrders.map(x => `
                <tr>

                  <td>
                    <b>${x.id}</b><br>
                    <small>${x.date}</small>
                  </td>

                  <td>
                    ${escapeHtml(x.customer||"")}<br><small>${escapeHtml(x.email||"")}</small><br>
                    ${x.district}
                  </td>

                  <td>${x.phone}</td>

                  <td><b>${money(x.total)}</b><br><small>Items: ${money(x.subtotal ?? x.total)} · Delivery: ${money(x.deliveryCharge ?? 0)}</small></td>

                  <td>
                    <span class="status ${x.status.toLowerCase()}">
                      ${x.status}
                    </span>
                  </td>

                  <td>
                    <select
                      onchange="setOrderStatus('${x.id}',this.value)"
                    >

                      <option ${x.status === "Pending" ? "selected" : ""}>
                        Pending
                      </option>

                      <option ${x.status === "Confirmed" ? "selected" : ""}>
                        Confirmed
                      </option>

                      <option ${x.status === "Shipped" ? "selected" : ""}>
                        Shipped
                      </option>

                      <option ${x.status === "Delivered" ? "selected" : ""}>
                        Delivered
                      </option>

                      <option ${x.status === "Cancelled" ? "selected" : ""}>
                        Cancelled
                      </option>

                    </select>
                    ${["Delivered","Cancelled"].includes(x.status) ? `<button class="btn light-btn" type="button" onclick="setOrderArchived('${x.id}',true)">Archive</button>` : ""}
                  </td>

                </tr>
              `).join("")
              : `
                <tr>
                  <td colspan="6">No orders yet.</td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
    <div id="archivedOrdersView" style="overflow:auto;display:none">
      <div class="order-list-heading"><h3>Archived orders (${archivedOrders.length})</h3><button type="button" class="mini" onclick="showOrderView('active')">Back to active orders</button></div>
      <table class="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>${archivedOrders.length ? archivedOrders.map(x => `<tr><td><b>${escapeHtml(x.id)}</b><br><small>${escapeHtml(x.date||"")}</small></td><td>${escapeHtml(x.customer||"")}<br><small>${escapeHtml(x.email||"")}</small><br>${escapeHtml(x.district||"")}</td><td>${escapeHtml(x.phone||"")}</td><td><b>${money(x.total)}</b></td><td><span class="status ${escapeHtml(x.status.toLowerCase())}">${escapeHtml(x.status)}</span></td><td><button class="btn light-btn" type="button" onclick="setOrderArchived('${x.id}',false)">Restore</button></td></tr>`).join("") : `<tr><td colspan="6">No archived orders.</td></tr>`}</tbody>
      </table>
    </div>
  `;

  document.getElementById("tab-store").innerHTML=`<h2>Storefront editor</h2><p>Edit the parts of your home page and footer below. Click a preview card to jump to its fields, then save.</p><div class="store-preview"><button type="button" data-focus-editor="heroTitle"><small>HOME PAGE · HERO</small><b>${escapeHtml(storeSettings.heroTitle)}</b><span>${escapeHtml(storeSettings.heroText)}</span><em>Edit hero →</em></button><button type="button" data-focus-editor="promoTitle"><small>HOME PAGE · OFFERS</small><b>${escapeHtml(storeSettings.promoTitle)}</b><span>${escapeHtml(storeSettings.promoLabel)}</span><em>Edit offers →</em></button><button type="button" data-focus-editor="storeAbout"><small>FOOTER · STORE</small><b>${escapeHtml(storeSettings.name)}</b><span>${escapeHtml(storeSettings.storeAbout)}</span><em>Edit footer →</em></button><button type="button" data-focus-editor="shopLinks"><small>FOOTER · LINKS & CONTACT</small><b>${escapeHtml(storeSettings.shopTitle)} · ${escapeHtml(storeSettings.supportTitle)} · ${escapeHtml(storeSettings.socialTitle)}</b><span>${escapeHtml(storeSettings.phone)} · ${escapeHtml(storeSettings.email)}</span><em>Edit footer links →</em></button></div><form class="admin-form storefront-editor" id="storeSettingsForm"><h3 class="wide editor-section-title">Store identity and announcement</h3><label>Store name<input name="name" required value="${escapeHtml(storeSettings.name)}"></label><label>Logo letter / symbol<input name="logoText" maxlength="3" value="${escapeHtml(storeSettings.logoText||"Z")}"><small>Used when you are not using an image logo.</small></label><label class="wide">Upload a logo image<input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPG, or WebP; maximum 5 MB. Uploading replaces the current logo.</small><span id="storeLogoPreview" class="store-logo-preview" aria-live="polite"></span></label><label class="wide logo-reset-option"><input name="useDefaultLogo" type="checkbox"> Use the letter logo instead of the uploaded image</label><label>Tagline<input name="tagline" value="${escapeHtml(storeSettings.tagline)}"></label><label>Customer phone<input name="phone" value="${escapeHtml(storeSettings.phone)}"></label><label>Customer email<input name="email" type="email" value="${escapeHtml(storeSettings.email)}"></label><label class="wide">Top announcement<input name="topMessage" value="${escapeHtml(storeSettings.topMessage)}"></label><h3 class="wide editor-section-title">Home page hero and offers</h3><label class="wide">Homepage headline<input name="heroTitle" value="${escapeHtml(storeSettings.heroTitle)}"></label><label class="wide">Homepage description<textarea name="heroText" rows="3">${escapeHtml(storeSettings.heroText)}</textarea></label><label>Promotion heading<input name="promoLabel" value="${escapeHtml(storeSettings.promoLabel)}"></label><label>Promotion title<input name="promoTitle" value="${escapeHtml(storeSettings.promoTitle)}"></label><label><input type="checkbox" name="promoEnabled" ${storeSettings.promoEnabled!==false?"checked":""}> Show promotions section</label><h3 class="wide editor-section-title">Delivery information on all product pages</h3><label class="wide">Delivery and return note<textarea name="deliveryInfo" rows="3">${escapeHtml(storeSettings.deliveryInfo)}</textarea><small>Shown in the Delivery tab for every product.</small></label><h3 class="wide editor-section-title">Footer: store, links and contact</h3><label class="wide">About your store<textarea name="storeAbout" rows="2">${escapeHtml(storeSettings.storeAbout)}</textarea></label><label>Shop heading<input name="shopTitle" value="${escapeHtml(storeSettings.shopTitle)}"></label><label>Support heading<input name="supportTitle" value="${escapeHtml(storeSettings.supportTitle)}"></label><label>Stay connected heading<input name="socialTitle" value="${escapeHtml(storeSettings.socialTitle)}"></label><label class="wide">Shop links (one per line: label | page link)<textarea name="shopLinks" rows="3">${escapeHtml(storeSettings.shopLinks)}</textarea></label><label class="wide">Stay connected links (one per line: label | URL)<textarea name="socialLinks" rows="3">${escapeHtml(storeSettings.socialLinks)}</textarea><small>Add Facebook and Instagram links here.</small></label><label class="wide">Copyright line<input name="footerNote" value="${escapeHtml(storeSettings.footerNote)}"></label><button class="btn orange" type="submit">Save storefront settings</button></form>`;
  const logoFileInput=document.querySelector('#storeSettingsForm [name="logoFile"]');
  const logoPreview=document.getElementById("storeLogoPreview");
  const defaultLogoToggle=document.querySelector('#storeSettingsForm [name="useDefaultLogo"]');
  let selectedLogoPreviewUrl="";
  const showLogoPreview=(url)=>{if(!logoPreview)return;logoPreview.replaceChildren();if(url){const image=document.createElement("img");image.src=url;image.alt="Logo preview";logoPreview.appendChild(image)}else{const mark=document.createElement("span");mark.className="tl-logo";mark.textContent=storeSettings.logoText||"Z";logoPreview.appendChild(mark)}};
  showLogoPreview(storeSettings.logoUrl||"");
  logoFileInput?.addEventListener("change",()=>{const file=logoFileInput.files?.[0];if(file){if(selectedLogoPreviewUrl)URL.revokeObjectURL(selectedLogoPreviewUrl);selectedLogoPreviewUrl=URL.createObjectURL(file);showLogoPreview(selectedLogoPreviewUrl);if(defaultLogoToggle)defaultLogoToggle.checked=false}});
  defaultLogoToggle?.addEventListener("change",()=>{if(defaultLogoToggle.checked){if(logoFileInput)logoFileInput.value="";showLogoPreview("")}else if(logoFileInput?.files?.[0])showLogoPreview(selectedLogoPreviewUrl);else showLogoPreview(storeSettings.logoUrl||"")});
  document.querySelectorAll("[data-focus-editor]").forEach(button=>button.onclick=()=>{const field=document.querySelector(`#storeSettingsForm [name="${button.dataset.focusEditor}"]`);field?.focus();field?.scrollIntoView({behavior:"smooth",block:"center"})});
  document.getElementById("storeSettingsForm").onsubmit=async event=>{event.preventDefault();const f=new FormData(event.currentTarget);try{let logoUrl=storeSettings.logoUrl||"";const logoFile=f.get("logoFile");if(logoFile&&logoFile.size)logoUrl=await uploadStoreLogo(logoFile);else if(f.has("useDefaultLogo"))logoUrl="";await saveStoreSettings({logoUrl,name:String(f.get("name")||"").trim(),logoText:String(f.get("logoText")||"").trim().slice(0,3)||"Z",tagline:String(f.get("tagline")||"").trim(),phone:String(f.get("phone")||"").trim(),email:String(f.get("email")||"").trim(),topMessage:String(f.get("topMessage")||"").trim(),heroTitle:String(f.get("heroTitle")||"").trim(),heroText:String(f.get("heroText")||"").trim(),promoLabel:String(f.get("promoLabel")||"").trim(),promoTitle:String(f.get("promoTitle")||"").trim(),promoEnabled:f.has("promoEnabled"),deliveryInfo:String(f.get("deliveryInfo")||"").trim(),storeAbout:String(f.get("storeAbout")||"").trim(),shopTitle:String(f.get("shopTitle")||"").trim(),shopLinks:String(f.get("shopLinks")||"").trim(),supportTitle:String(f.get("supportTitle")||"").trim(),supportLinks:"Return policy | return-policy.html",socialTitle:String(f.get("socialTitle")||"").trim(),socialLinks:String(f.get("socialLinks")||"").trim(),footerNote:String(f.get("footerNote")||"").trim()});showToast("Storefront settings saved ✓")}catch(error){console.error(error);showToast(error?.message||"Could not save storefront settings.")}};
  const deliverySettings = await getDeliverySettings();
  document.getElementById("tab-delivery").innerHTML = `
    <h2>Delivery settings</h2>
    <p style="color:#667085">Set the courier label and delivery rates here. Checkout uses these rates automatically based on the customer's district and optional exact-area rules. Settings are shared through Supabase for all customers.</p>
    <form class="admin-form" id="deliverySettingsForm">
      <label>Courier / delivery provider</label>
      <input name="courier" value="${String(deliverySettings.courier || "Other").replace(/&/g,"&amp;").replace(/"/g,"&quot;")}" placeholder="Other">
      <label>Store / origin district</label>
      <input name="originDistrict" value="${String(deliverySettings.originDistrict || "").replace(/&/g,"&amp;").replace(/"/g,"&quot;")}" placeholder="Rajshahi" required>
      <label>Store / origin area (optional)</label>
      <input name="originArea" value="${String(deliverySettings.originArea || "").replace(/&/g,"&amp;").replace(/"/g,"&quot;")}" placeholder="Your area">
      <label>Same district / local (৳)</label>
      <input name="sameDistrict" type="number" min="0" step="1" value="${Number(deliverySettings.sameDistrict) || 0}" required>
      <label>Dhaka city (৳)</label>
      <input name="dhakaCity" type="number" min="0" step="1" value="${Number(deliverySettings.dhakaCity) || 0}" required>
      <label>Other districts (৳)</label>
      <input name="otherDistrict" type="number" min="0" step="1" value="${Number(deliverySettings.otherDistrict) || 0}" required>
      <div class="field full-field"><label>Optional area-specific rates (one per line: District | Area | Charge)</label>
      <textarea name="areaOverrides" rows="5" placeholder="Rajshahi | Boalia | 80&#10;Dhaka | Uttara | 70">${String(deliverySettings.areaOverrides || "").replace(/&/g,"&amp;").replace(/</g,"&lt;")}</textarea>
      <small>Example: Rajshahi | Boalia | 80. Exact district + area match takes priority over general rates.</small></div>
      <button class="btn orange" type="submit">Save delivery settings</button>
    </form>
    <p><b>How it calculates:</b> exact area rule → Dhaka city rate → same-district/local rate → other-district rate.</p>
  `;
  document.getElementById("deliverySettingsForm").onsubmit = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const next = {
      courier: String(form.get("courier") || "Other").trim() || "Other",
      originDistrict: String(form.get("originDistrict") || "").trim(),
      originArea: String(form.get("originArea") || "").trim(),
      sameDistrict: Math.max(0, Number(form.get("sameDistrict")) || 0),
      dhakaCity: Math.max(0, Number(form.get("dhakaCity")) || 0),
      otherDistrict: Math.max(0, Number(form.get("otherDistrict")) || 0),
      areaOverrides: String(form.get("areaOverrides") || "").trim()
    };
    saveDeliverySettings(next).then(()=>showToast("Delivery settings saved ✓")).catch(error=>{console.error(error);showToast("Could not save settings. Check Supabase SQL/RLS.")});
  };
}

function resetProductForm(){const f=document.getElementById("productForm");if(!f)return;f.reset();f.elements.productId.value="";f.elements.img.placeholder="Image URL";document.getElementById("productFormTitle").textContent="Add a product";f.querySelector('button[type="submit"]').textContent="Add product";document.getElementById("cancelProductEdit").hidden=true;document.getElementById("removeImagesLabel").hidden=true}
function editProduct(id){const p=(window.adminProducts||[]).find(x=>String(x.id)===String(id));if(!p)return;const f=document.getElementById("productForm");f.elements.productId.value=p.id;f.elements.name.value=p.name||"";f.elements.brand.value=p.brand||"";f.elements.cat.value=p.cat||"Other";f.elements.price.value=p.price||"";f.elements.old.value=p.old||"";f.elements.stock.value=p.stock||0;f.elements.img.value="";f.elements.img.placeholder="Leave blank to keep existing photos";f.elements.badge.value=p.badge||"";f.elements.featured.value=String(!!p.featured);f.elements.description.value=p.description||p.desc||"";f.elements.specifications.value=p.specifications||"";f.elements.features.value=p.features||"";document.getElementById("removeImagesLabel").hidden=!(p.images?.length||p.img);document.getElementById("productFormTitle").textContent="Edit product";f.querySelector('button[type="submit"]').textContent="Save changes";document.getElementById("cancelProductEdit").hidden=false;f.scrollIntoView({behavior:"smooth",block:"center"})}
function productStoragePath(url,productId){try{const parsed=new URL(url);const marker="/storage/v1/object/public/product-images/";const index=parsed.pathname.indexOf(marker);if(index<0)return null;const path=decodeURIComponent(parsed.pathname.slice(index+marker.length));return path.startsWith(`${productId}/`)?path:null}catch{return null}}
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  const {data:images,error:imageReadError}=await supabaseClient.from("product_images").select("url").eq("product_id",id);
  if(imageReadError){showToast("Could not load product images before deletion.");return}
  const {error:imageDeleteError}=await supabaseClient.from("product_images").delete().eq("product_id",id);
  if(imageDeleteError){showToast("Could not delete the product image records.");return}
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    console.error("Delete product error:", error);
    showToast("Could not delete product. Check Supabase permissions.");
    return;
  }
  const paths=(images||[]).map(row=>productStoragePath(row.url,id)).filter(Boolean);
  if(paths.length){const {error:removeError}=await supabaseClient.storage.from("product-images").remove(paths);if(removeError)console.error("Product image file cleanup failed:",removeError)}
  showToast("Product deleted ✓");
  await renderAdmin();
}
async function setOrderStatus(id,status){try{await saveOrderStatus(id,status);await renderAdmin();showToast("Order status updated ✓")}catch(error){showToast("Could not update order status. Check permissions.")}}
function showOrderView(view){
  const active=document.getElementById("activeOrdersView"), archived=document.getElementById("archivedOrdersView");
  if(!active||!archived)return;
  active.style.display=view==="active"?"":"none";
  archived.style.display=view==="archived"?"":"none";
}
function openArchivedOrders(){
  document.querySelector('.admin-tabs button[data-tab="orders"]')?.click();
  showOrderView("archived");
}
async function setOrderArchived(id,archived){
  try{await saveOrderArchive(id,archived);await renderAdmin();showOrderView(archived?"active":"archived");showToast(archived?"Order archived ✓":"Order restored ✓")}
  catch(error){showToast("Could not update the order. Check Supabase permissions and setup SQL.")}
}
console.log("Supabase loaded:", !!supabaseClient);
console.log("Supabase URL:", SUPABASE_URL);
console.log("ZENVIX Supabase connection ready");
getProducts();





