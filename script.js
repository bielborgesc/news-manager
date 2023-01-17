//Lista as categorias no Menu
function pegarCatecorias(){
     $("nav#menu ul").append("<li>Cadastrar</li>")
    $.getJSON("https://tiagoifsp.ddns.net/noticias/categorias/listar.php", function(data){
        $.each(data, (key, val) => {
            CriarMenu(val)
            criarSelect(val)
        })
        exibirNoticias()
    })
}
//Cria as Li com cada categoria
pegarCatecorias()
function CriarMenu(val){
    $("nav#menu ul").append(`<li class="categorias"id="${val.id}">${val.nome}</li>`)
}
//Colocando categorias
function criarSelect(val){
    $("select").append(`<option value="${val.id}">${val.nome}</option>`)
}
//parte de cadastro
function cadastro(){
    let li = document.getElementsByTagName("li")[0]
    li.onclick = (e) =>{
        let h2 = document.querySelector(".h2").innerText = "Cadastrar Nova Noticia"
        document.querySelector("#principal").style.display = "block"
        document.querySelector("#edicao").style.display = "none"
        document.querySelector("#exibir").style.display = "none"
        document.querySelector(".h2").style.display = "block"
        let botao = document.querySelector(".cadastrar")
        botao.onclick = (e2) =>{
            submeter()
            limparCampos()
        }
    }
}
cadastro()
//parte da submissão
function submeter(){
    let categoria = document.querySelector("#categoria").value
    let titulo = document.querySelector("#titulo").value
    let subtitulo = document.querySelector("#subtitulo").value
    let conteudo = document.querySelector("#conteudo").value
    
    $.ajax({
        type: "POST",
        url: "https://tiagoifsp.ddns.net/noticias/noticias/cadastrar.php",
        data: {titulo: titulo, subtitulo: subtitulo, conteudo: conteudo, idCategoria: categoria},
        success(data){
            toastr["success"]("Sua Notícia foi cadastrada com sucesso.", "Noticia Cadastrada")
        },erro(e){
            toastr["error"](`[ERRO] ${e}:`, "Houve uma falha")
        }
    })
}
function limparCampos(){
    let inputs = document.querySelectorAll("input")
    let select = document.querySelectorAll("select").values = 1
    document.querySelector("textarea").value = ""

    inputs.forEach(valor =>{
        valor.value = ""
    })
}
//Exibição das noticias
function exibirNoticias(){
    let categorias = document.querySelectorAll(".categorias")
    categorias.forEach(element => {
        element.onclick = (e) =>{
            document.querySelector("#edicao").style.display = "none"
            document.querySelector("#principal").style.display = "none"
            let id = element.id
            let nome = e.path[0].innerText
            removerTags()
            requisicaoDaNoticia(id,nome)
        }
    })
}
function requisicaoDaNoticia(id,nome){
    $.getJSON(`https://tiagoifsp.ddns.net/noticias/noticias/listar.php?id=${id}`,function(data){
        let h2 = document.querySelector(".h2").innerText = `${nome}`
        document.querySelector(".h2").style.display = "block"
        data.forEach(element => {
            criarEspaco(element)
        })
    })
}
function criarEspaco(element){
    document.querySelector("#exibir").style.display = "block"
    $("#exibir").append(`<h3 class="dados">Titulo</h3>`)
    $("#exibir").append(`<p class="dados">${element.titulo}</p>`)
    $("#exibir").append(`<h3 class="dados">Subtitulo</h3>`)
    $("#exibir").append(`<p class="dados">${element.subtitulo}</p>`)
    $("#exibir").append(`<h3 class="dados">Conteúdo</h3>`)
    $("#exibir").append(`<p class="dados">${element.conteudo}</p>`)
    if(element.editavel == 1){
        addBotoes(element)
    }else{
        $("#exibir").append(`<p class="dados">Não Editável</p>`)
    }
}
function removerTags(){
    let dados = document.querySelectorAll(".dados")
    dados.forEach(tags =>{
        tags.remove()
    })
}
function addBotoes(element){
    $("#exibir").append(`<p class="dados" id='${element.id}'><button class="cadastrar editar">Editar</button> <button class="cadastrar delete">Deletar</button></p>`)
    funcionamentoBotao(element)
}
function funcionamentoBotao(data){
    let botao = document.querySelectorAll(".editar")
    botao.forEach(element => {
        element.onclick = (e) =>{
            editar(data)
        }
    })

    let dell = document.querySelectorAll(".delete")
    dell.forEach(element2 => {
        element2.onclick = (e2) =>{
            excluir(data)
        }
    })
}

//Editar
function editar(data){
    document.querySelector("#exibir").style.display = "none"
    let h2 = document.querySelector(".h2").innerText = "Editar Notícia"
    document.querySelector(".h2").style.display = "block"
    document.querySelector("#edicao").style.display = "block"

    let indiceCategoria = data.idCategoria
    let categoria = document.querySelectorAll(`#menu li`)
    let nomeCat = categoria[indiceCategoria].innerText

    let editCat = document.querySelector("#editar-categoria").value = nomeCat
    let editTit = document.querySelector("#editar-titulo").value = `${data.titulo}`
    let editSub = document.querySelector("#editar-subtitulo").value = `${data.subtitulo}`
    let editContend = document.querySelector("#editar-conteudo").value = `${data.titulo}`

    let botao = document.querySelector("#enviar-edit")
    botao.onclick = (e) => submeterEdit(data)
}
function editar(data){
    document.querySelector("#exibir").style.display = "none"
    let h2 = document.querySelector(".h2").innerText = "Editar Notícia"
    document.querySelector(".h2").style.display = "block"
    document.querySelector("#edicao").style.display = "block"

    let indiceCategoria = data.idCategoria

    let editCat = document.querySelector("#editar-categoria").value = indiceCategoria
    let editTit = document.querySelector("#editar-titulo").value = `${data.titulo}`
    let editSub = document.querySelector("#editar-subtitulo").value = `${data.subtitulo}`
    let editContend = document.querySelector("#editar-conteudo").value = `${data.titulo}`
    let botao = document.querySelector("#enviar-edit")
    botao.onclick = (e) => submeterEdit(data)
}
function submeterEdit(dados){
    let editCat = document.querySelector("#editar-categoria").value
    let editTit = document.querySelector("#editar-titulo").value
    let editSub = document.querySelector("#editar-subtitulo").value
    let editContend = document.querySelector("#editar-conteudo").value


    $.ajax({
        type: "POST",
        url: "https://tiagoifsp.ddns.net/noticias/noticias/editar.php",
        data: {
            id: dados.id,
            titulo: editTit,
            subtitulo: editSub,
            conteudo: editContend,
            idCategoria: editCat
        },
        success(data){
            toastr["success"]("Sua Notícia foi editada com sucesso.", "Noticia Alterada")
            document.querySelector(".h2").style.display = "none"
            document.querySelector("#edicao").style.display = "none"
        },
        erro(e){
            toastr["error"](`[ERRO] ${e}:`, "Houve uma falha")
        }
    })
}
//Excluir
function excluir(dados){
    let identificador = dados.id
    console.log(identificador)
    $.ajax({
        type: "GET",
        url:`https://tiagoifsp.ddns.net/noticias/noticias/deletar.php?id=${identificador}`,
        data: {
            id: dados.id,
            titulo: dados.titulo,
            subtitulo: dados.subtitulo,
            conteudo: dados.conteudo,
            idCategoria: dados.idCategoria
        },
        success(data){
            toastr["success"]("Sua Notícia foi deletada com sucesso.", "Noticia Deletada")
            document.querySelector(".h2").style.display = "none"
            document.querySelector("#edicao").style.display = "none"
        },
        erro(e){
            toastr["error"](`[ERRO] ${e}:`, "Houve uma falha")
        }
    })
}