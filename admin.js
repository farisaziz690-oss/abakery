cekLogin();
    let gambar = document.getElementById('gambar').value;

    const { error } = await supabaseClient
    .from('menu')
    .insert([
        {
            nama,
            deskripsi,
            harga,
            gambar
        }
    ]);

    if(error) {
        alert('Gagal menambahkan menu');
        console.log(error);
    }
    else {
        alert('Menu berhasil ditambahkan');
        tampilMenu();
    }


async function tampilMenu() {

    let container = document.getElementById('admin-menu');

    container.innerHTML = '';

    const { data, error } = await supabaseClient
    .from('menu')
    .select('*');

    data.forEach(menu => {

        container.innerHTML += `

        <div class="menu-item">

            <img src="${menu.gambar}" alt="">

            <h3>${menu.nama}</h3>

            <p>${menu.deskripsi}</p>

            <p><b>Rp ${menu.harga}</b></p>

            <button onclick="hapusMenu(${menu.id})">
                Hapus
            </button>

        </div>

        `;
    });
}

async function hapusMenu(id) {

    await supabaseClient
    .from('menu')
    .delete()
    .eq('id', id);

    tampilMenu();
}

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = 'login.html';
}

tampilMenu();