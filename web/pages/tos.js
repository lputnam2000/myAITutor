import Head from 'next/head'
import styled from 'styled-components'

const Main = styled.main`
  min-height: 100vh;
`


export default function Home() {

    return (
        <>
            <Head>
                <title>ChimpBase</title>
                <meta name="Terms of Service"
                    content="Chimpbase is revolutionizing the way people consume information. Our innovative software extracts key details from large pieces of text, video and PDFs to create smart notes that help users understand and retain information quickly and easily. Join the waitlist today and join the Chimp Squad to simplify your information overload " />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/svg/bananas.svg" />
            </Head>
            <Main>
                <div>
                    Terms of Service Agreement
                    Last Updated: 3/26/2023
                    <br />

                    Welcome to Chimpbase! This is an agreement between you (&quotyou&quot or &quotuser&quot) and Chimpbase,
                    LLC
                    (&quotChimpbase,&quot &quotwe,&quot or &quotus&quot) regarding your use of the website,
                    www.chimpbase.com (the &quotSite&quot).

                    <br />

                    Acceptance of Terms <br />

                    By using the Site, you agree to be bound by these Terms of Service, our Privacy Policy, and all
                    applicable laws and regulations. If you do not agree to these terms, please do not use the Site.

                    <br />

                    Use of Site <br />

                    You may use the Site only for lawful purposes and in accordance with these Terms of Service. You agree
                    not to use the Site in any way that violates any applicable federal, state, local, or international law
                    or regulation.
                    <br />


                    User Accounts <br />

                    Users may create accounts on the Site to access certain features. You are responsible for maintaining
                    the confidentiality of your account information and for all activities that occur under your account.
                    You agree to notify us immediately of any unauthorized use of your account or any other breach of
                    security.

                    <br />

                    User Content <br />

                    Users may submit content to the Site, including but not limited to pdfs, websites, and youtube videos.
                    By submitting content, you represent and warrant that you have the right to do so and that the content
                    does not violate any applicable laws or infringe on any third-party rights, including intellectual
                    property rights. You agree to indemnify and hold Chimpbase harmless from any claims arising from your
                    submission of content.

                    <br />

                    DMCA Compliance <br />

                    Chimpbase complies with the Digital Millennium Copyright Act (DMCA). If you believe that your
                    copyrighted material has been posted on the Site without your authorization, please notify us at
                    chimpbase@gmail.com. We will investigate the claim and remove the content if necessary.
                    <br />


                    Disclaimer of Warranties <br />

                    The Site and all content, materials, and features available on the Site are provided &quotas is&quot and
                    &quotas
                    available&quot without any warranties, express or implied. Chimpbase disclaims all warranties of any
                    kind,
                    whether express or implied, including but not limited to the implied warranties of merchantability,
                    fitness for a particular purpose, and non-infringement.
                    <br />


                    Limitation of Liability <br />

                    Chimpbase will not be liable for any damages of any kind arising from the use of the Site, including but
                    not limited to direct, indirect, incidental, punitive, and consequential damages. Chimpbase will also
                    not be liable for any content submitted by users.
                    <br />


                    Changes to Terms of Service <br />

                    We may modify these Terms of Service at any time in our sole discretion. Your continued use of the Site
                    after any modification constitutes your acceptance of the updated terms.
                    <br />


                    Governing Law <br />

                    These Terms of Service and any disputes arising from or relating to the Site will be governed by and
                    construed in accordance with the laws of the State of Illinois, without giving effect to any choice or
                    conflict of law provision or rule.

                    <br />

                    Contact Information <br />

                    If you have any questions about these Terms of Service or the Site, please contact us at
                    chimpbase@gmail.com.
                    <br />


                    By using the Site, you agree to the terms and conditions of this agreement.
                </div>
            </Main>
        </>
    )
}
