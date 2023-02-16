import React, {useContext} from 'react';

import { Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import { PDFViewerContext } from "./context";


interface ReadingIndicatorProps {
    store: Store<StoreProps>;
}

const ReadingIndicator: React.FC<ReadingIndicatorProps> = ({ store }) => {
    const [percentages, setPercentages] = React.useState(0);
    const {setScrollPosition} = useContext(PDFViewerContext);
    

    const handleScroll = (e: Event) => {
        const target = e.target;
        if (target instanceof HTMLDivElement) {
            const p = Math.floor((100 * target.scrollTop) / (target.scrollHeight - target.clientHeight));
            setPercentages(Math.min(100, p));
            setScrollPosition((100 * target.scrollTop) / (target.scrollHeight - target.clientHeight));
        }
    };

    const handlePagesContainer = () => {
        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }

        const pagesEle = getPagesContainer();
        pagesEle.addEventListener('scroll', handleScroll);
    };

    React.useLayoutEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);

        return () => store.unsubscribe('getPagesContainer', handlePagesContainer);
    }, []);

    return (
        <div
            style={{
                height: '4px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgb(53, 126, 221)',
                    height: '100%',
                    width: `${percentages}%`,
                }}
            />
        </div>
    );
};

export default ReadingIndicator;