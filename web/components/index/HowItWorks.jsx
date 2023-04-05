import styled from 'styled-components';

const HowItWorksTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  max-width: 80%;
  margin: 0 auto;
`;

const StepBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const StackedLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
`

const TextWithGif = styled.div`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 2rem;
`;


const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const BigWords = styled.div`
  font-size: 3rem;
`

const GradientText = styled.span`
  font-size: 1.4rem;
  background: rgb(211,131,242);
  background: linear-gradient(90deg, rgba(211,131,242,1) 0%, rgba(226,43,216,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BoomText = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(to right, #ff1493, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const Subtitle = styled.p`
  padding: 1rem 0 0 0;
  font-size: 1.2rem;
  text-align: left;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    margin-bottom: 1rem;
  }
`;

const GifImage = styled.img`
  display: block;
  width: 50%;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 15px 0px rgba(255, 255, 255, 0.5);
`;

const StepByStep = () => {
    return (
        <>
            <HowItWorksTitle>How It Works</HowItWorksTitle></>);/*
            <GridContainer>
                <StepBox>
                    <TextWithGif reverse={true}>
                        <GifImage src="/gifs/step1.gif" alt="Step 1" />
                        <StackedLabels>
                            <BigWords>Upload Your Content</BigWords>
                            <GradientText>PDFs, Websites, MP4s, Youtube </GradientText>
                            <Subtitle>
                                <ul>
                                    <li>Upload the content you would like to summarize or query.</li>
                                    <li>We even have a Chrome extension if you want to quickly websites to your library with just 2 clicks!</li>
                                    <li>We even support large content, like textbooks and lecture videos.</li>
                                </ul>
                            </Subtitle>
                        </StackedLabels>
                    </TextWithGif>
                </StepBox>
                <StepBox>
                    <TextWithGif reverse={false}>
                        <GifImage src="/gifs/step2.gif" alt="Step 1" />
                        <StackedLabels>
                            <BigWords>Wait a minute or two and...</BigWords>
                            <BoomText>Go Bananas</BoomText>
                            <Subtitle>
                                <ul>
                                    <li>Generating comprehensive summaries for your uploaded content is the least we can do.</li>
                                    <li>Using the power of GPT and some data manipulation techniques we can quickly find exactly what you are looking for, even if you can only give a vague description.</li>
                                </ul>
                            </Subtitle>

                        </StackedLabels>
                    </TextWithGif>
                </StepBox>
            </GridContainer>
        </>
    );*/
};

export default StepByStep;