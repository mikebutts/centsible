import Login from "@/components/Login"
import SubscriptionForm from "@/components/SubscriptionForm"
import SubscriptionsDisplay from "@/components/SubscriptionsDisplay"
import SubscriptionsSummary from "@/components/SubscriptionsSummary"


export default function DashboardPage(){

    const isauthenticated = true
    const isAddEntry =true

    if (!isauthenticated) {
        return(
            <Login />
        )
    }

    return(
       <>
        <SubscriptionsDisplay />
        <SubscriptionsSummary />
        {( isAddEntry && <SubscriptionForm /> )}
       </>
    )
}