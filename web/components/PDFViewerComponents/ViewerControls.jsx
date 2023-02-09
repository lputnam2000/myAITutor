import React, {useContext} from 'react';
import styled from 'styled-components'
import {PDFViewerContext} from "@/components/PDFViewerComponents/context";
import {IconButton} from '@chakra-ui/react'
import {ArrowLeftIcon, ArrowRightIcon,} from "@chakra-ui/icons";

const Container = styled.div`
  border-radius: 500px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  background-color: #fdfd98;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: space-around;

  &:hover {
    opacity: 1;
  }

  left: ${(props) => props.left}px;
  bottom: 50px;
  position: fixed;
  width: 200px;
  height: 40px;
  z-index: 2;
`

const Input = styled.input`
  background-color: inherit;
  border: 1px solid black;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
`

const Span = styled.span`
  font-weight: bold;
  opacity: 1;
`

function ViewerControls({pageWidth}) {
    const {numPages, pageNumber, setPageNumber} = useContext(PDFViewerContext)

    const changeCurrentPage = (e) => {
        setPageNumber(e.target.value)
        if (e.target.value >= numPages) {
            setPageNumber(parseInt(numPages))
        }
    }
    const updatePageNumber = (val) => {
        setPageNumber(parseInt(pageNumber) + val)
    }

    const inputFocusOut = (e) => {
        if (pageNumber === '') {
            setPageNumber(1)
        }
    }
    const validatePageNumberInput = (e) => {
        let keycode = e.which;
        if (!(e.shiftKey === false && (keycode === 46 || keycode === 8 || keycode === 37 || keycode === 39 || (keycode >= 48 && keycode <= 57)))) {
            e.preventDefault();
        }
    }


    return (
        <Container left={(pageWidth - 50) / 2}>
            <IconButton isDisabled={pageNumber === 1} onClick={() => updatePageNumber(-1)} aria-label='Previous Page'
                        style={{backgroundColor: 'inherit', borderRadius: '500px'}}
                        icon={<ArrowLeftIcon/>}/>
            <Span>

                <Input type="number" onBlur={inputFocusOut} onKeyDown={validatePageNumberInput} value={pageNumber}
                       min={1} max={numPages}
                       onChange={changeCurrentPage}/>&nbsp;
                / {numPages}
            </Span>
            <IconButton isDisabled={pageNumber === numPages} onClick={() => updatePageNumber(1)} aria-label='Next Page'
                        style={{backgroundColor: 'inherit', borderRadius: '500px'}}
                        icon={<ArrowRightIcon/>}/>
        </Container>
    );
}

export default ViewerControls;