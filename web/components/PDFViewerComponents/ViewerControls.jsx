import React, {useContext} from 'react';
import styled from 'styled-components'
import {PDFViewerContext} from "@/components/PDFViewerComponents/context";

const Container = styled.div`
  background-color: yellow;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 40px;
  z-index: 2;
`

function ViewerControls(props) {
    const {numPages, pageNumber, setPageNumber} = useContext(PDFViewerContext)

    const changeCurrentPage = (e) => {
        setPageNumber(e.target.value)
        if (e.target.value >= numPages) {
            setPageNumber(numPages)
        }
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
        <Container>

            <input type="number" onBlur={inputFocusOut} onKeyDown={validatePageNumberInput} value={pageNumber}
                   min={1} max={numPages}
                   onChange={changeCurrentPage}/>&nbsp;
            - {numPages}

        </Container>
    );
}

export default ViewerControls;