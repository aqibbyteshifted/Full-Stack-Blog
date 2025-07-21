import { Metadata } from "next"
import HomePage from "@/components/home/page"
export const metadata: Metadata = {
    title: "Home",
    description: "Home Page",
}

export default function Home() {
  return <HomePage />
}