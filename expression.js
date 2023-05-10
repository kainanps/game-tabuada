function validarOperacao(operador, fator1, fator2, resultado) {
    switch (operador) {
        case '+':
            return fator1 + fator2 === resultado
        case '-':
            return fator1 - fator2 === resultado
        case '*':
            return fator1 * fator2 === resultado
        case '/':
            return fator1 / fator2 === resultado
        default:
            return false
    }
}

function gerarPergunta(operador) {
    const numero1 = Math.floor(Math.random() * 10)
    const numero2 = Math.floor(Math.random() * 10)
    const numero1El = document.querySelector('.number1')
    const numero2El = document.querySelector('.number2')
    const operadorEl = document.querySelector('.operator-symbol')
    numero1El.textContent = numero1
    numero2El.textContent = numero2
    operadorEl.textContent = operador
}

let totalCorretas = 0
let totalErradas = 0
let intervalActive = false

function exibirRespostas(validacao, expressao) {
    const respostasCorretas = document.querySelector('.respostas-corretas')
    const respostasErradas = document.querySelector('.respostas-erradas')

    if (validacao) {
        totalCorretas++
        respostasCorretas.innerHTML += `<p class="respostas">${expressao}</p>`
        respostasCorretas.querySelector('.total-respotas-corretas').innerHTML = `Total de respostas corretas:<span class='total-resposta'>${totalCorretas}</span>`
    } else {
        totalErradas++
        respostasErradas.innerHTML += `<p class="respostas">${expressao}</p>`
        respostasErradas.querySelector('.total-respotas-erradas').innerHTML = `Total de respostas erradas: <span class='total-resposta'>${totalErradas}</span>`
    }
}


const respostaInput = document.getElementById('resposta')
const verificarBtn = document.querySelector('.verificar-btn')

verificarBtn.addEventListener('click', () => {
    const resposta = Number(respostaInput.value)
    executarPegunta(resposta)
    respostaInput.value = ""
})

respostaInput.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        const resposta = Number(respostaInput.value)
        executarPegunta(resposta)
        respostaInput.value = ""
    }
})

function executarPegunta(resposta) {
    const operadorSelecionado = document.querySelector('.operador-btn.selected').innerHTML
    const expressao = document.querySelector('.expressao').innerHTML
    const numero1 = Number(document.querySelector('.number1').innerHTML)
    const numero2 = Number(document.querySelector('.number2').innerHTML)
    gerarPergunta(operadorSelecionado)
    const resultado = validarOperacao(operadorSelecionado, numero1, numero2, resposta)

    if (resultado) {
        respostaCorreta = "correto"
        exibirRespostas(true, expressao + " = " + resposta)
    } else {
        respostaCorreta = "errado"
        exibirRespostas(false, expressao + " = " + resposta)
    }
}

var respostaCorreta = ""
const buttons = document.querySelectorAll('.operador-btn')

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('selected'))
        button.classList.add('selected')
    })
})

const iniciarBtn = document.getElementById('iniciar')
const reiniciarBtn = document.getElementById('reiniciar')
const modal = document.getElementById('modal')
const modalClose = document.querySelector('.modal-close')
const inputTime = document.getElementById('time')
const inputRepeticoes = document.getElementById('repeticoes')

inputRepeticoes.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        iniciarBtn.click()
    }
})

iniciarBtn.addEventListener('click', () => {
    const operadorSelecionado = document.querySelector('.operador-btn.selected')
    const tempo = inputTime.value
    const repeticoes = inputRepeticoes.value

    if (operadorSelecionado && tempo && repeticoes) {
        // chama a função gerarPergunta passando o operador selecionado
        if (!intervalActive) {
            startTimer(tempo, operadorSelecionado.innerHTML, repeticoes)
        }
        respostaInput.focus()
    } else {
        // exibe o modal de erro
        modal.style.display = 'block'
    }

})

reiniciarBtn.addEventListener('click', () => {
    const operadorSelecionado = document.querySelector('.operador-btn.selected')
    const tempo = inputTime.value
    const repeticoes = inputRepeticoes.value

    if (operadorSelecionado && tempo && repeticoes) {
        // chama a função gerarPergunta passando o operador selecionado
        if (!intervalActive) {
            document.querySelectorAll('.respostas').forEach(e => { e.remove() })
            document.querySelectorAll('.total-resposta').forEach(e => { e.remove() })
            startTimer(tempo, operadorSelecionado.innerHTML, repeticoes)
        }
        respostaInput.focus()
    } else {
        // exibe o modal de erro
        modal.style.display = 'block'
    }
})

modalClose.addEventListener('click', () => {
    modal.style.display = 'none'
})

function startTimer(duration, operador, repeticoes) {
    respostaInput.removeAttribute('disabled')
    intervalActive = true
    gerarPergunta(operador)
    const timerBar = document.querySelector('.timer-bar')
    timerBar.style.width = `0px`
    let time = duration * 1000 / 60
    console.log(duration)

    let interval = setInterval(
        function () {
            let largura = Number(timerBar.style.width.split('px')[0])
            if (largura <= 300) {
                if (respostaCorreta == "") {
                    timerBar.style.width = `${largura + 5}px`
                } else {
                    timerBar.style.width = `0px`
                    respostaCorreta = ""
                    repeticoes--
                    if (repeticoes <= 0) {
                        if (totalCorretas > totalErradas) {
                            exibirModalGanhouPerdeu('#venceu')
                        } else {
                            exibirModalGanhouPerdeu('#perdeu')
                        }
                        totalCorretas = 0
                        totalErradas = 0
                        respostaInput.setAttribute('disabled', '')
                        intervalActive = false
                        clearInterval(interval)
                    }
                }

            } else {
                timerBar.style.width = `0px`
                const resposta = Number(respostaInput.value)
                executarPegunta(resposta)
                respostaInput.value = ""
                respostaCorreta = ""
                repeticoes--
                if (repeticoes <= 0) {
                    if (totalCorretas > totalErradas) {
                        exibirModalGanhouPerdeu('#venceu')
                    } else {
                        exibirModalGanhouPerdeu('#perdeu')
                    }
                    totalCorretas = 0
                    totalErradas = 0
                    respostaInput.setAttribute('disabled', '')
                    intervalActive = false
                    clearInterval(interval)
                }
            }
        },
        time
    )
    document.getElementById('parar').onclick = e => { stopTime(interval) }
}

function stopTime(interval) {
    totalCorretas = 0
    totalErradas = 0
    respostaInput.setAttribute('disabled', '')
    intervalActive = false
    clearInterval(interval)
}

function exibirModalGanhouPerdeu(classe) {
    const modal = document.querySelector(classe)
    modal.style.display = 'flex'
}

function closeModal() {
    const modal = document.querySelectorAll('.custom-modal')
    modal.forEach(e => {
        e.style.display = 'none'
    })
}

const closeButton = document.querySelectorAll('.custom-modal-close')
closeButton.forEach(e => {
    e.addEventListener('click', closeModal)
})

window.addEventListener("keydown", e => {
    if (e.keyCode === 13 || e.keyCode === 27) {
        modal.style.display = 'none'
        closeButton.forEach(e => { e.click() })
    }
})
