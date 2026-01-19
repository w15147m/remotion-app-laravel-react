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
      fill={'#FF9A9E'}
    />,
  );

  // Scrollable Layout
  view.add(
    <Layout ref={scrollContainer} x={0} y={0}>
      {videoItems.map((item, index) => (
        <Rect
          key={item.id.toString()}
          x={index * itemSpacing}
          width={cardWidth}
          height={cardHeight}
          fill={'white'}
          radius={20}
        >
          <Layout direction={'column'} alignItems={'center'} layout padding={40}>
            {/* Placeholder for Image to avoid CORS issues */}
            <Rect
              width={300}
              height={300}
              radius={150}
              fill={(item as any).color || '#ccc'}
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
