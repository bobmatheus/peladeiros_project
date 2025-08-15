/***************************************************
 * CONFIGURAÇÃO GERAL DA API
 ***************************************************/
const API_BASE = "https://apipeladeiros.onrender.com/api";

async function fetchAPI(endpoint, method = "GET", body = null, auth = false) {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
        const token = localStorage.getItem("access_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    if (response.status !== 204) {
        return response.json();
    }
    return null;
}

function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/***************************************************
 * RESERVAS - Página reservas.html
 ***************************************************/
if (document.body.classList.contains("page-reservas")) {
    const container = document.getElementById("espacos-container");

    async function loadEspacos() {
        container.innerHTML = "<p>Carregando espaços...</p>";
        try {
            const espacos = await fetchAPI("/espacos/");
            container.innerHTML = espacos.length
                ? espacos.map(espaco => `
                    <div class="item-card">
                        <div class="item-main-content">
                            <div class="item-img">
                                <img src="${espaco.foto || '/static/images/default-image.png'}" alt="${espaco.nome}">
                            </div>
                            <div class="item-content">
                                <h3>${espaco.nome}</h3>
                                <p>${espaco.descricao}</p>
                                <div class="price">A partir de ${formatCurrency(espaco.preco_minimo || 0)} / ${espaco.modelo_de_cobranca}</div>
                            </div>
                        </div>
                        <button class="btn add-to-cart">Adicionar ao Carrinho</button>
                    </div>
                `).join("")
                : "<p>Nenhum espaço disponível no momento.</p>";
        } catch {
            container.innerHTML = "<p>Erro ao carregar espaços.</p>";
        }
    }

    loadEspacos();
}

/***************************************************
 * MINHAS RESERVAS
 ***************************************************/
if (document.body.classList.contains("page-minhas-reservas")) {
    async function loadReservas(status, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "<p>Carregando reservas...</p>";
        try {
            const reservas = await fetchAPI(`/reservas/?status=${status}`, "GET", null, true);
            container.innerHTML = reservas.length
                ? reservas.map(r => `
                    <div class="reserva-card">
                        <div class="reserva-card-body">
                            <h3>${r.espaco.nome}</h3>
                            <p>Data: ${formatDate(r.data_inicio)} - ${formatTime(r.data_inicio)} até ${formatTime(r.data_fim)}</p>
                            <p>Preço: ${formatCurrency(r.preco_final)}</p>
                        </div>
                    </div>
                `).join("")
                : "<p>Nenhuma reserva encontrada.</p>";
        } catch {
            container.innerHTML = "<p>Erro ao carregar reservas.</p>";
        }
    }

    loadReservas("proximas", "reservas-proximas");
    loadReservas("utilizadas", "reservas-utilizadas");
    loadReservas("canceladas", "reservas-canceladas");
}

/***************************************************
 * LISTA DE MENSAGENS
 ***************************************************/
if (document.body.classList.contains("page-lista-mensagens")) {
    const tbody = document.getElementById("mensagens-table-body");

    async function loadMensagens() {
        tbody.innerHTML = `<tr><td colspan="5">Carregando mensagens...</td></tr>`;
        try {
            const mensagens = await fetchAPI("/mensagens/", "GET", null, true);
            tbody.innerHTML = mensagens.length
                ? mensagens.map(m => `
                    <tr>
                        <td>${formatDate(m.data_envio)}</td>
                        <td>${m.nome}</td>
                        <td>${m.assunto}</td>
                        <td>${m.lida ? "Lida" : "Não Lida"}</td>
                        <td><a href="/detalhe_mensagem.html?id=${m.id}" class="btn btn-sm btn-info">Ver</a></td>
                    </tr>
                `).join("")
                : `<tr><td colspan="5">Nenhuma mensagem encontrada.</td></tr>`;
        } catch {
            tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar mensagens.</td></tr>`;
        }
    }

    loadMensagens();
}

/***************************************************
 * DETALHE MENSAGEM
 ***************************************************/
if (document.body.classList.contains("page-detalhe-mensagem")) {
    const container = document.getElementById("mensagem-detalhe-container");
    const id = getQueryParam("id");

    async function loadMensagem() {
        container.innerHTML = "<p>Carregando...</p>";
        try {
            const m = await fetchAPI(`/mensagens/${id}/`, "GET", null, true);
            container.innerHTML = `
                <p><strong>De:</strong> ${m.nome}</p>
                <p><strong>Email:</strong> ${m.email}</p>
                <p><strong>Mensagem:</strong> ${m.mensagem}</p>
                <button id="marcar-lida" class="btn btn-success">Marcar como Lida</button>
                <button id="apagar" class="btn btn-danger">Apagar</button>
            `;

            document.getElementById("marcar-lida").onclick = async () => {
                await fetchAPI(`/mensagens/${id}/`, "PATCH", { lida: true }, true);
                alert("Mensagem marcada como lida");
                loadMensagem();
            };

            document.getElementById("apagar").onclick = async () => {
                await fetchAPI(`/mensagens/${id}/`, "DELETE", null, true);
                alert("Mensagem apagada");
                window.location.href = "/lista_mensagens.html";
            };
        } catch {
            container.innerHTML = "<p>Erro ao carregar mensagem.</p>";
        }
    }

    loadMensagem();
}

/***************************************************
 * LOGIN
 ***************************************************/
if (document.body.classList.contains("page-login")) {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const data = await fetchAPI("/token/", "POST", { username, password });
            localStorage.setItem("access_token", data.access);
            alert("Login realizado com sucesso!");
            window.location.href = "/";
        } catch {
            alert("Usuário ou senha inválidos.");
        }
    });
}

/***************************************************
 * CRIAR CONTA
 ***************************************************/
if (document.body.classList.contains("page-criar-conta")) {
    const form = document.getElementById("registration-form");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form));
        try {
            await fetchAPI("/usuarios/", "POST", formData);
            alert("Conta criada com sucesso!");
            window.location.href = "/entrar.html";
        } catch {
            alert("Erro ao criar conta.");
        }
    });
}

/***************************************************
 * MINHA CONTA
 ***************************************************/
if (document.body.classList.contains("page-minha-conta")) {
    const form = document.getElementById("minha-conta-form");

    async function loadUser() {
        try {
            const user = await fetchAPI("/usuarios/me/", "GET", null, true);
            Object.keys(user).forEach(key => {
                if (form[key]) form[key].value = user[key] || "";
            });
        } catch (err) {
            console.error(err);
        }
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form));
        try {
            await fetchAPI("/usuarios/me/", "PUT", formData, true);
            alert("Dados atualizados com sucesso!");
        } catch {
            alert("Erro ao atualizar dados.");
        }
    });

    loadUser();
}

/***************************************************
 * CONTATO
 ***************************************************/
if (document.body.classList.contains("page-contato")) {
    const form = document.getElementById("contato-form");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form));
        try {
            await fetchAPI("/mensagens/", "POST", formData);
            alert("Mensagem enviada com sucesso!");
            form.reset();
        } catch {
            alert("Erro ao enviar mensagem.");
        }
    });
}

/***************************************************
 * HOME (INDEX)
 ***************************************************/
if (document.body.classList.contains("page-index")) {
    const container = document.getElementById("espacos-home-container");

    async function loadEspacosHome() {
        container.innerHTML = "<p>Carregando...</p>";
        try {
            const espacos = await fetchAPI("/espacos/");
            container.innerHTML = espacos.slice(0, 3).map(e => `
                <div class="feature-card">
                    <div class="feature-img"><img src="${e.foto || '/static/images/default-image.png'}" alt="${e.nome}"></div>
                    <div class="feature-content">
                        <h3>${e.nome}</h3>
                        <p>${e.descricao}</p>
                        <div class="price">${formatCurrency(e.preco_minimo || 0)} / ${e.modelo_de_cobranca}</div>
                        <a href="/reservas.html" class="btn">Reservar Agora</a>
                    </div>
                </div>
            `).join("");
        } catch {
            container.innerHTML = "<p>Erro ao carregar espaços.</p>";
        }
    }

    loadEspacosHome();
}
