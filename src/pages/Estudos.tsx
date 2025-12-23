import AnimatedPage from "@/components/AnimatedPage"
import { HeaderEstudos } from "@/components/estudos/HeaderEstudos"
import React from "react"

export const Estudos = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen p-6">
        <HeaderEstudos />

        {/* Conteúdo da página */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Seus estudos</h2>
          <p className="text-gray-600">
            Aqui você pode listar matérias, metas diárias, cronograma etc.
          </p>
        </div>
      </div>
    </AnimatedPage>
  )
}
