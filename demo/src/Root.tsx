import {Composition} from 'remotion';
import {TalousDemo, DEMO_DURATION, FPS} from './TalousDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TalousDemo"
      component={TalousDemo}
      durationInFrames={DEMO_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
