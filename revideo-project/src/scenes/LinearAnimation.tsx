import { makeScene2D } from '@revideo/2d';
import { createRef, all } from '@revideo/core';
import { Rect, Txt, Layout, Img } from '@revideo/2d';
import { videoItems } from '../data';

export default makeScene2D('linear-animation', function* (view) {
  const scrollContainer = createRef<Layout>();
  const cardWidth = 600;
  const cardHeight = 800;
  const gap = 40;
  const itemSpacing = cardWidth + gap;

  // Background
  view.add(
    <Rect
      size={['100%', '100%']}
      fill={'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)'}
    />,
  );

  // Scrollable Layout
  view.add(
    <Layout ref={scrollContainer} x={0} y={0}>
      {videoItems.map((item, index) => (
        <Rect
          key={item.id}
          x={index * itemSpacing}
          width={cardWidth}
          height={cardHeight}
          fill={'white'}
          radius={20}
          shadowBlur={40}
          shadowColor={'rgba(0,0,0,0.1)'}
          clip
        >
          <Layout direction={'column'} alignItems={'center'} layout padding={40}>
            <Img
              src={item.mediaUrl}
              width={300}
              height={300}
              radius={150}
              marginBottom={40}
            />
            <Txt
              text={item.title}
              fontFamily={'Arial'}
              fontWeight={700}
              fontSize={48}
              fill={'#333'}
              marginBottom={10}
            />
            <Txt
              text={item.subtitle}
              fontFamily={'Arial'}
              fontSize={32}
              fill={'#666'}
              marginBottom={40}
            />
            <Rect
              width={'100%'}
              height={4}
              fill={'#eee'}
              marginBottom={40}
            />
            <Txt
              text={`Rank: #${item.rankNumber}`}
              fontFamily={'Arial'}
              fontWeight={600}
              fontSize={36}
              fill={'#e91e63'}
            />
          </Layout>
        </Rect>
      ))}
    </Layout>,
  );

  // Animation: Scroll through items
  const totalWidth = (videoItems.length - 1) * itemSpacing;

  // Start from first item centered
  scrollContainer().x(0);

  // Animate scrolling to the left
  yield* scrollContainer().x(-totalWidth, videoItems.length * 2);
});
