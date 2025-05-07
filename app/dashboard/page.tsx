import Login from "@/components/Login"
import SubscriptionsDisplay from "@/components/SubscriptionsDisplay"
import SubscriptionsSummary from "@/components/SubscriptionsSummary"


export default function DashboardPage(){

    const isauthenticated = false
    if (!isauthenticated) {
        return(
            <Login />
        )
    }

    return(
       <>
        <SubscriptionsDisplay />
        <SubscriptionsSummary />
       </>
    )
}