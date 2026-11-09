import { Suspense } from "react"
import CompanionCard from "@/components/CompanionCard"
import CompanionsList from "@/components/CompanionsList"
import CTA from "@/components/CTA"
import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/actions/companion.actions"
import { getSubjectColor } from "@/lib/utils"

async function PopularCompanions() {
  const companions = await getAllCompanions({ limit: 3 })

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
      {companions.map((companion) => (
        <CompanionCard
          key={companion.id}
          {...companion}
          color={getSubjectColor(companion.subject)}
        />
      ))}
    </section>
  )
}

async function RecentSessionsList() {
  const recentSessionsCompanions = await getRecentSessions(10)

  return (
    <CompanionsList
      title="Recently completed sessions"
      companions={recentSessionsCompanions}
      classNames="w-2/3 max-lg:w-full mb-15"
    />
  )
}

const Page = () => {
  return (
    <main>
      <h1>Popular Companions</h1>
      <Suspense
        fallback={
          <div className="flex flex-wrap gap-4 items-start w-full">
            Loading popular companions...
          </div>
        }
      >
        <PopularCompanions />
      </Suspense>

      <section className="home-section mb-20">
        <Suspense
          fallback={
            <div className="companion-list w-2/3 max-lg:w-full mb-15">
              Loading recent sessions...
            </div>
          }
        >
          <RecentSessionsList />
        </Suspense>
        <CTA />
      </section>
    </main>
  )
}

export default Page
