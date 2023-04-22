import React, {useEffect, useRef, useState} from 'react';
import styled, {keyframes} from 'styled-components';

const slideDown = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const HeadlineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.25rem;
  @media (min-width: 1536px) {
    padding: 0;
  }
`;

const GradientHeading = styled.h1`
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.25));
  animation: ${slideDown} 0.5s ease-out;

  @media (min-width: 768px) {
    font-size: 3.75rem;
    line-height: 5rem;
  }
  @media (max-width: 600px) {
    font-size: 30px;
  }
`;

const SubHeading = styled.p`
  opacity: 0;
  margin-top: 0.5rem;
  text-align: center;
  color: #A0AEC0;
  animation: ${slideDown} .5s ease-out .4s forwards;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SignUpButton = styled.a`
  background-color: #ffe135;
  color: black;
  margin-top: 20px;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 4px;
  opacity: 0;
  animation: ${slideDown} .5s ease-out .6s forwards;

`

const GifVideo = styled.video`
  margin-top: 30px;
  opacity: 0;
  animation: ${slideDown} .5s ease-out .9s forwards;
  display: block;
  width: 50%;
  border-radius: 8px;
  box-shadow: 0 0 15px 0px rgba(255, 255, 255, 0.5);

  @media (max-width: 1200px) {
    width: 60%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;


const Content = styled.div`
  display: ${({show}) => (show ? 'block' : 'none')};
`;

const HeadlineComponent = () => {
    const [showContent, setShowContent] = useState(false);
    const handleAnimationEnd = () => {
        setShowContent(true);
    };

    return (
        <HeadlineWrapper>
            <GradientHeading>
                Supercharge your Learning Potential
            </GradientHeading>
            <SubHeading onAnimationEnd={handleAnimationEnd}>
                Get Instant Answers, In-Depth Explanations, and Essay Writing
                Assistance All in One App!
            </SubHeading>
            <SignUpButton href={'/home'}>
                Start Learning For Free!
            </SignUpButton>
            <GifVideo autoPlay={true}
                      loop={true}
                      controls={false}
                      muted
                      playsInline
                      alt="Step 2">
                <source src="/gifs/step2.mp4" type="video/mp4"/>
            </GifVideo>
        </HeadlineWrapper>
    );
};

export default HeadlineComponent;
