async function tampilMenu() {

    const { data, error } = await supabaseClient
    .from('menu')
    .select('*');

    let container = document.getElementById('menu-container');

    container.innerHTML = '';

    data.forEach(menu => {

        container.innerHTML += `

        <div class="menu-item">

            <img src="${menu.gambar}" alt="">

            <h3>${menu.nama}</h3>

            <p>${menu.deskripsi}</p>

            <p><b>Rp ${menu.harga}</b></p>

            <div class="btn-wrapper">
                <a href="https://wa.me/6283853779281?text=Saya%20ingin%20pesan%20${menu.nama}"
                   target="_blank"
                   class="btn-wa">
                   Pesan Sekarang
                </a>
            </div>

        </div>

        `;
    });
}
