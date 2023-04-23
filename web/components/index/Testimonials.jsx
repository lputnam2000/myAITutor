import React from 'react';
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

const Container = styled.div`
  min-width: 250px;
  width: 100%;
  padding: 2px;
`;

const Card = styled.div`
  height: 100%;
  border-radius: 24px;
  background-color: #222831;
  padding: 16px 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Stars = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
`;

const StarIcon = styled.svg`
  width: 19px;
  height: 18px;
  fill: #f59e0b;
`;

const Heading = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
`;

const Name = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`;


const ReviewCard = ({data}) => (
    <Container>
        <Card>
            <FlexContainer>
                <div>
                    <Stars>
                        {[...Array(5)].map((_, index) => (
                            <StarIcon key={index} viewBox="0 0 19 18">
                                <path
                                    d="M9.30769 0L12.1838 5.82662L18.6154 6.76111L13.9615 11.2977L15.0598 17.7032L9.30769 14.6801L3.55554 17.7032L4.65385 11.2977L0 6.76111L6.43162 5.82662L9.30769 0Z"/>
                            </StarIcon>
                        ))}
                    </Stars>
                    <Heading>{data.heading}</Heading>
                    <Text>
                        {data.subheading}
                    </Text>
                </div>
                <Name>{data.name}</Name>
            </FlexContainer>
        </Card>
    </Container>
);

const CardsContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: auto auto;
  grid-auto-rows: none;
  grid-gap: 20px;
  justify-items: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  max-height: calc(2 * (100% / 3));
  @media (max-width: 768px) {
    grid-gap: 10px;
    max-height: calc(2 * (100% / 2));
  }
`;


const TestimonialContainer = styled.div`
  margin-top: 40px;
  opacity: 0;
  animation: ${slideDown} .5s ease-out .8s forwards;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`


const TestimonialsHeading = styled.h2`
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  letter-spacing: -0.02em;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.25));
  @media (min-width: 768px) {
    font-size: 3.75rem;
    line-height: 5rem;
  }
  @media (max-width: 600px) {
    font-size: 30px;
  }
`

const userTestimonials = [{
    heading: "School on Easy Mode",
    subheading: "\"I can't college without Chimpbase! It's super easy to use and helps me get quick answers to my homework and quiz questions. I stan chimpbase\"",
    name: "Aravind N."
},
    {
        heading: "Must Have",
        subheading: "\"Dude, Chimpbase is a life-saver! It's so easy to upload lectures and get answers to my quizzes. I always use it when cramming for exams!\"",
        name: "Henry K."
    },
    {
        heading: "Saving So Much Time",
        subheading: "\"Chimpbase made online learning so much easier for me by providing quick and accurate answers to all my questions. I can't imagine getting through college without it!\"",
        name: "Henry K."
    },
    {
        heading: "Lifesaver",
        subheading: "\"Chimpbase is lowkey the best thing to happen to my academic life. It's so user-friendly and provides quick answers to all my learning questions. I highly recommend it to my fellow students!\"",
        name: "Jordan O."
    },
    // {
    //     heading: "Must Have",
    //     subheading: "\"It's so easy to upload lectures and get answers to my quizzes. I always use it when cramming for exams!\"",
    //     name: "José S."
    // }
]


const Testimonials = () => {
    return (
        <TestimonialContainer>
            <TestimonialsHeading>
                Students love ChimpBase.
            </TestimonialsHeading>
            <CardsContainer>
                {userTestimonials.map((t, idx) => <ReviewCard data={t} key={idx}/>)}
            </CardsContainer>
        </TestimonialContainer>
    )
}


export default Testimonials;
