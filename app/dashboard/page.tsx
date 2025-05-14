"use client"

import Login from "@/components/Login"
import SubscriptionForm from "@/components/SubscriptionForm"
import SubscriptionsDisplay from "@/components/SubscriptionsDisplay"
import SubscriptionsSummary from "@/components/SubscriptionsSummary"
import { useState } from "react"


export default function DashboardPage(){

    const isauthenticated = true
   
    const [isAddEntry, setIsAddEntry] = useState(false)

    function handleToggleInput(){
        setIsAddEntry(!isAddEntry)
    }

    if (!isauthenticated) {
        return(
            <Login />
        )
    }

    return(
       <>
        <SubscriptionsDisplay />
        <SubscriptionsSummary />
        {isAddEntry && (
            <SubscriptionForm onsubmit={() => {}} closeInput={()=> {handleToggleInput}} /> )}
       </>
    )
}