import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import dateformat from "dateformat";
import Image from 'next/image'


export default function Campaign({ data }) {
    const [submitted, setIsSubmitted,] = useState(false)
    const [submitting, setIsSubmitting,] = useState(false)
    const [email, setEmail] = useState("")

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const opinions = {
            method: "POST",
            body: JSON.stringify({
                email,
                campaign: data.id
            }),

            headers:{
                "Content-Type": "application/json"
            }
        }

        setIsSubmitting(true)
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subscribers`, opinions).then(res => res.json()).then(response => console.log("response", response)).catch(error => console.log("error", error)).finally(()=>{
            setIsSubmitting(false)
        })
    }

    const { query: { slug } } = useRouter()

    return (
        <div>
            <div className={styles.item}>
                <div className={styles.imgContainer}>
                    <Image className={styles.img} src={"https://res.cloudinary.com/djw2ks8ek/" + data.logo} height={120} width={120} alt="Campaña banner" />
                </div>

                <div className={styles.rightItems}>
                    <Link href={"/" + data.slug}>
                        <a>{data.title}</a>
                    </Link>
                    <p>{data.description} </p>
                    <small>{dateformat(new Date(data.created_at), "dddd, mmmm, dS, yyyy, h:MM:ss TT")} </small>
                </div>
                <div className={styles.rightContents}>
                    <form onSubmit={handleOnSubmit}>
                        <div className={styles.formGroup}>
                            <input
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                }}
                                required type="email"
                                name="email"
                                placeholder="Ingresa el correo" className={styles.input} />
                        </div>
                        <div className={styles.submit}>
                            <input type="submit" value="SUBSCRIBE" className={styles.button} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`)

    const data = await response.json()

    const allSlugs = data.map(item => item.slug)

    const paths = allSlugs.map(slug => ({ params: { slug: slug } }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${params.slug}`)

    const data = await response.json()

    return {
        props: {
            data
        }
    }
}