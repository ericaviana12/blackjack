/**
 * Blackjack
 * Regras básicas:
 * - O jogador compete contra a banca (dealer).
 * - O objetivo é somar pontos próximos de 21 sem ultrapassá-lo.
 */

const nipes = ['♥', '♦', '♣', '♠']
const faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
let baralho = []
let jogador = { cartas: [], pontos: 0 }
let dealer = { cartas: [], pontos: 0 }
let jogoEncerrado = false // Estado do jogo

function criarBaralho() {
    baralho = []
    for (let nipe of nipes) {
        for (let face of faces) {
            baralho.push({ face, nipe, valor: calcularValor(face) })
        }
    }
    baralho = baralho.sort(() => Math.random() - 0.5) // Embaralha o baralho
}

function calcularValor(face) {
    if (face === "A") return 11
    if (["J", "Q", "K"].includes(face)) return 10
    return parseInt(face)
}

function renderizarCarta(carta) {
    return `<div class="carta" style="color: ${carta.nipe === '♥' || carta.nipe === '♦' ? '#f00' : '#000'}">
                <div>${carta.face}</div>
                <div>${carta.nipe}</div>
            </div>`
}

function atualizarInterface() {
    document.getElementById('jogador').querySelector('.cartas').innerHTML = 
        jogador.cartas.map(renderizarCarta).join('')
    document.getElementById('dealer').querySelector('.cartas').innerHTML = 
        dealer.cartas.map(renderizarCarta).join('')
    document.getElementById('pontos-jogador').innerText = `Pontos: ${jogador.pontos}`
    document.getElementById('pontos-dealer').innerText = `Pontos: ${dealer.pontos}`
}

function novaRodada() {
    criarBaralho()
    jogador.cartas = [baralho.pop(), baralho.pop()]
    dealer.cartas = [baralho.pop()]
    jogador.pontos = calcularPontos(jogador.cartas)
    dealer.pontos = calcularPontos(dealer.cartas)
    jogoEncerrado = false // Reinicia o estado do jogo
    atualizarInterface()
    document.getElementById('resultado').innerText = ''
}

function calcularPontos(cartas) {
    let pontos = cartas.reduce((acc, carta) => acc + carta.valor, 0)
    let temAs = cartas.some(carta => carta.face === "A")
    if (pontos > 21 && temAs) pontos -= 10 // A vira 1 se estourar 21
    return pontos
}

function comprarCarta() {
    if (jogoEncerrado) {
        exibirMensagemNovoJogo()
        return // Impede a interação se o jogo terminou
    }
    if (jogador.pontos >= 21) return
    jogador.cartas.push(baralho.pop())
    jogador.pontos = calcularPontos(jogador.cartas)
    atualizarInterface()
    if (jogador.pontos > 21) {
        document.getElementById('resultado').innerText = "Você perdeu! Banca venceu."
        jogoEncerrado = true // Finaliza o jogo
    }
}

function parar() {
    if (jogoEncerrado) {
        exibirMensagemNovoJogo()
        return // Impede a interação se o jogo terminou
    }
    while (dealer.pontos < 17) {
        dealer.cartas.push(baralho.pop())
        dealer.pontos = calcularPontos(dealer.cartas)
    }
    atualizarInterface()
    verificarResultado()
}

function verificarResultado() {
    if (jogador.pontos > 21) {
        document.getElementById('resultado').innerText = "Você perdeu! Banca venceu."
    } else if (dealer.pontos > 21 || jogador.pontos > dealer.pontos) {
        document.getElementById('resultado').innerText = "Você venceu!"
    } else if (jogador.pontos < dealer.pontos) {
        document.getElementById('resultado').innerText = "Você perdeu! Banca venceu."
    } else {
        document.getElementById('resultado').innerText = "Empate!"
    }
    jogoEncerrado = true // Finaliza o jogo
}

function exibirMensagemNovoJogo() {
    document.getElementById('resultado').innerText = 
        "O jogo terminou. Clique em 'Nova Rodada' para iniciar um novo jogo."
}

// Inicializar o jogo
novaRodada()
