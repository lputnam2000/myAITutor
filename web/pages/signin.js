import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]";
import { useRef, useState, componentDidMount, useEffect } from "react"
import { useRouter } from 'next/router';
import styles from "/styles/signin.module.scss"


export default function SignIn({ csrfToken, providers }) {
    const pageContainer = useRef();
    const emailInputRef = useRef();
    const router = useRouter();
    const googleSignIn = async (e) => {
        e.preventDefault()
        let googleProvider = Object.values(providers).filter(provider => provider.name == "Google")
        signIn(googleProvider[0].id)
    }
    const emailSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(
            `/api/auth/signin/email`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    'email': emailInputRef.current.value,
                    'csrfToken': csrfToken,
                }),
            }).then((response) => {
                if (response.ok) {
                    console.log("sent")
                    setEmailForm(<div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-x-2 tw-rounded-md tw-border tw-border-slate-600 tw-bg-slate-700 tw-py-3 tw-px-4 tw-text-cbgreen"><h1>Email Sent</h1><h2>Use link in email to login</h2></div>)
                }
            })
    };
    const [emailForm, setEmailForm] = useState(<div className="tw-grid tw-gap-y-3">
        <input
            ref={emailInputRef}
            type="email" name="email"
            className="focus:tw-border-purple-400 tw-rounded-md tw-border tw-border-cbblue tw-bg-slate-700 tw-py-3 tw-px-4 tw-text-slate-200 tw-outline-none transition placeholder:tw-text-slate-400"
            placeholder="email@example.com"
        />
        <button
            onClick={emailSubmit}
            className="tw-flex tw-items-center tw-justify-center tw-gap-x-2 tw-rounded-md tw-border tw-border-cbblue tw-bg-slate-700 tw-py-3 tw-px-4 tw-text-cbpink transition hover:tw-text-cbblack"
        >
            Sign in with Email
        </button>
    </div>)
    const svg = <object className={styles.monkeyIcon} data={"/svg/monkey1.svg"} />
    return (
        <>
            {/*Object.values(providers).filter(entry => entry.name !== "Email").map((provider) => (
                <div key={provider.name}>
                    <button onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                    </button>
                </div>
            ))*/}

            <div ref={pageContainer}
                className="tw-grid tw-h-screen tw-w-screen tw-bg-cbblue tw-px-4 tw-text-sm tw-font-medium"
            >
                <div className="tw-flex tw-flex-col tw-justify-center">
                    {svg}
                    <div className="tw-mx-auto tw-w-full tw-max-w-sm tw-rounded-lg tw-bg-cbwhite tw-shadow">
                        <form className="tw-p-4 md:tw-p-5 tw-lg:p-6">
                            <div className="tw-grid tw-gap-y-3">
                                <button
                                    className="tw-flex tw-items-center tw-justify-center tw-gap-x-2 tw-rounded-md tw-border tw-border-cbblue tw-bg-cbwhite tw-py-3 tw-px-4 tw-text-cbpink transition hover:tw-text-cbblack"
                                    onClick={googleSignIn}
                                >
                                    <svg
                                        style={{'color':"rgb(203, 213, 225)"}}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        fill="currentColor"
                                        class="bi bi-google"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                                            fill="#cbd5e1"
                                        ></path>
                                    </svg>
                                    Sign in with Google
                                </button>
                            </div>

                            <div className="tw-my-3 tw-flex tw-items-center tw-px-3">
                                <hr className="tw-w-full tw-border-slate-600" />
                                <span className="tw-mx-3 tw-text-cbblack">or</span>
                                <hr className="tw-w-full tw-border-slate-600" />
                            </div>
                            {emailForm}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    const csrfToken = await getCsrfToken(context)

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!

    if (session) {
        return { redirect: { destination: "/home" } };
    }

    const providers = await getProviders(context);

    return {
        props: { providers: Object.values(providers) ?? [], csrfToken },
    }
}