import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 225px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
  overflow: hidden;
  transition: box-shadow ease-in-out .1s;

  &:hover {
    box-shadow: 4px 4px 0px ${props => props.theme.colors.secondary};
    transform: translate(-1px, -1px)
  }

  background-color: ${props => props.theme.colors.primary};
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
`

const CardInformation = styled.div`
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 15px 10px;
  overflow: hidden;
  background-color: #fafdd4;
  border-top: solid 1px;

`

const CenteredText = styled.div`
  font-weight: 600;
  font-size: 14px;
  white-space: ${props => props.fileType === 'url' ? 'normal' : 'nowrap'};
  overflow: hidden;
  text-overflow: ${props => props.fileType === 'url' ? 'none' : 'ellipsis'};
`

const TagList = styled.div`
  background-color: #fafdd4;
  display: flex;
`
const Tag = styled.div`
  margin: 10px;
  font-size: 13px;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: #ef59e8;
  color: white;

`


const typeToLabel = {
    'pdf': 'PDF',
    'url': 'Website',
    'youtube': 'YouTube'
}

function PdfCard({title, uploadId, thumbnail, type}) {
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    useEffect(() => {
        if (type === 'youtube') {
            const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(title)}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    setThumbnailUrl(data.thumbnail_url);
                })
                .catch(error => console.error(error));
        }
    }, [type])

    return (
        <Container href={`/summary?uploadId=${uploadId}&fileType=${type}`}>
            {type === 'pdf' && <ImageContainer>
                <img src={thumbnail} alt="" onerror={(e) => {
                    e.target.style.display = "none"
                }}/>
            </ImageContainer>}
            {type === 'youtube' && <ImageContainer>
                <img src={thumbnailUrl} alt="" onerror={(e) => {
                    e.target.style.display = "none"
                }}/>
            </ImageContainer>}
            <CardInformation>
                <CenteredText fileType={type}>{title}</CenteredText></CardInformation>
            <TagList>
                <Tag>{typeToLabel[type]}</Tag>
            </TagList>
        </Container>
    );
}

export default PdfCard;