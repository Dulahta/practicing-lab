import Link from "next/link"
import classes from "./header.module.css"

export default function Header() {
  return (
        <header id="header" className={classes.header}>
            <nav>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/products/new">New Products!</Link></li>
                    <li><Link href="/products/promo">Promotional Products!</Link></li>
                </ul>
            </nav>
        </header>
  )
}
