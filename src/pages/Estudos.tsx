import AnimatedPage from "@/components/AnimatedPage"
import { AreaGeral } from "@/components/estudos/AreaGeral"
import { HeaderEstudos } from "@/components/estudos/HeaderEstudos"

export const Estudos = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen p-6">
        <HeaderEstudos />

        <div className="mt-5">
          <AreaGeral />
        </div>
      </div>
    </AnimatedPage>
  )
}
