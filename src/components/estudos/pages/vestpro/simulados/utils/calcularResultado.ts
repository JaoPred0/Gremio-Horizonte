import type { Questao } from "../data/questoes"
import { ResultadoSimulado, Dificuldade } from "@/types/Simulado"

const XP_POR_DIFICULDADE: Record<Dificuldade, number> = {
  facil: 10,
  medio: 20,
  dificil: 30,
  muito_dificil: 40,
  misto: 20
}

export function calcularResultado(
  questoes: Questao[],
  respostas: Record<string, number | undefined>
): ResultadoSimulado {
  let acertos = 0
  let puladas = 0

  const xpPorDificuldade: ResultadoSimulado["xpPorDificuldade"] = {
    facil: 0,
    medio: 0,
    dificil: 0,
    muito_dificil: 0,
    misto: 0
  }

  questoes.forEach(q => {
    const resposta = respostas[q.id]

    if (resposta === undefined) {
      puladas++
      return
    }

    if (resposta === q.correta) {
      acertos++
      xpPorDificuldade[q.dificuldade] += XP_POR_DIFICULDADE[q.dificuldade]
    }
  })

  const erros = questoes.length - acertos - puladas
  const xpTotal = Object.values(xpPorDificuldade).reduce((a, b) => a + b, 0)

  return {
    totalQuestoes: questoes.length,
    acertos,
    erros,
    puladas,
    percentual: Math.round((acertos / questoes.length) * 100),
    xpTotal,
    xpPorDificuldade
  }
}
