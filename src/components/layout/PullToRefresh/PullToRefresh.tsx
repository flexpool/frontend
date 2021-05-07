import * as React from 'react';
import { DIRECTION, isTreeScrollable } from './isScrollable';
import styled from 'styled-components/macro';
import LoaderDots from 'src/components/Loader/LoaderDots';
import { BiRefresh } from 'react-icons/bi';

const PullContainer = styled.div`
  opacity: 0.5;
  height: 100vh;
  padding-top: 0.75rem;
  display: flex;
  align-items: top;
  justify-content: center;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  border-bottom: 10px solid var(--bg-primary);
  svg {
    font-size: 1.5rem;
  }
`;

const pullDownContentDefault = <PullContainer></PullContainer>;
const releaseContentDefault = (
  <PullContainer>
    <BiRefresh />
  </PullContainer>
);

const refreshContentDefault = (
  <PullContainer>
    <LoaderDots />
    {/* <LoaderDots /> */}
  </PullContainer>
);

export interface PullToRefreshProps {
  pullDownContent?: JSX.Element;
  releaseContent?: JSX.Element;
  refreshContent?: JSX.Element;
  pullDownThreshold: number;
  onRefresh: () => Promise<any>;
  triggerHeight?: number | 'auto';
  backgroundColor?: string;
  startInvisible?: boolean;
}

export interface PullToRefreshState {
  pullToRefreshThresholdBreached: boolean;
  maxPullDownDistance: number;
  onRefreshing: boolean;
}

export class PullToRefresh extends React.Component<
  PullToRefreshProps,
  PullToRefreshState
> {
  private container: any;

  private containerRef(container: any) {
    this.container = container;
  }

  private pullDown: any;

  private pullDownRef(pullDown: any) {
    this.pullDown = pullDown;
    const maxPullDownDistance =
      this.pullDown &&
      this.pullDown.firstChild &&
      this.pullDown.firstChild['getBoundingClientRect']
        ? this.pullDown.firstChild['getBoundingClientRect']().height
        : 0;
    this.setState({ maxPullDownDistance });
  }

  private dragging = false;
  private startY = 0;
  private currentY = 0;

  constructor(props: Readonly<PullToRefreshProps>) {
    super(props);
    this.state = {
      pullToRefreshThresholdBreached: false,
      maxPullDownDistance: 0,
      onRefreshing: false,
    };

    this.containerRef = this.containerRef.bind(this);
    this.pullDownRef = this.pullDownRef.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  public componentDidMount(): void {
    if (!this.container) {
      return;
    }

    this.container.addEventListener('touchstart', this.onTouchStart);
    this.container.addEventListener('touchmove', this.onTouchMove);
    this.container.addEventListener('touchend', this.onEnd);
    this.container.addEventListener('mousedown', this.onTouchStart);
    this.container.addEventListener('mousemove', this.onTouchMove);
    this.container.addEventListener('mouseup', this.onEnd);
  }

  public componentWillUnmount(): void {
    if (!this.container) {
      return;
    }

    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchend', this.onEnd);
    this.container.removeEventListener('mousedown', this.onTouchStart);
    this.container.removeEventListener('mousemove', this.onTouchMove);
    this.container.removeEventListener('mouseup', this.onEnd);
  }

  private onTouchStart(e: any) {
    const { triggerHeight = 40 } = this.props;
    this.startY = e['pageY'] || e.touches[0].pageY;
    this.currentY = this.startY;

    if (triggerHeight === 'auto') {
      const target = e.target;

      const container = this.container;
      if (!container) {
        return;
      }

      // an element we're touching can be scrolled up, so gesture is going to be a scroll gesture
      if (e.type === 'touchstart' && isTreeScrollable(target, DIRECTION.up)) {
        return;
      }

      // even though we're not scrolling, the pull-to-refresh isn't visible to the user so cancel
      if (container.getBoundingClientRect().top < 0) {
        return;
      }
    } else {
      const { top } = this.container.getBoundingClientRect();

      if (this.startY - top > triggerHeight) {
        return;
      }
    }
    this.dragging = true;
    this.container.style.transition = 'none';
    this.pullDown.style.transition = 'none';
    this.container.style.transition = 'transform 0.05s';
    this.pullDown.style.transition = 'transform 0.05s';
  }

  private onTouchMove(e: any) {
    if (!this.dragging) {
      return;
    }

    this.currentY = e['pageY'] || e.touches[0].pageY;
    if (this.currentY < this.startY) {
      return;
    }

    e.preventDefault();

    if (this.currentY - this.startY >= this.props.pullDownThreshold) {
      this.setState({
        pullToRefreshThresholdBreached: true,
      });
    }

    if (this.currentY - this.startY > this.state.maxPullDownDistance) {
      return;
    }

    this.container.style.overflow = 'visible';
    this.container.style.transform = `translate(0px, ${
      this.currentY - this.startY - (this.currentY - this.startY) * 0.55
    }px)`;
    this.pullDown.style.visibility = 'visible';
  }

  private onEnd() {
    //cubic-bezier(.76,1.14,.96,.59)
    const tr = 'cubic-bezier(.3,.79,.39,.78)';
    const duration = (this.currentY - this.startY) / 1000 / 2.2;
    this.container.style.transition = `transform ${duration}s ${tr}`;
    this.pullDown.style.transition = `transform ${duration}s ${tr}`;
    this.dragging = false;
    this.startY = 0;
    this.currentY = 0;

    if (!this.state.pullToRefreshThresholdBreached) {
      this.pullDown.style.visibility = this.props.startInvisible
        ? 'hidden'
        : 'visible';
      this.initContainer();
      return;
    }

    this.container.style.overflow = 'visible';
    this.container.style.transform = `translate(0px, 0px)`;
    setTimeout(() => {
      this.setState(() => {
        this.props.onRefresh().then(() => {
          this.initContainer();
          setTimeout(() => {
            this.setState({
              onRefreshing: false,
              pullToRefreshThresholdBreached: false,
            });
          }, 200);
        });
      });
    }, 100);
    this.setState({
      onRefreshing: true,
    });
  }

  private initContainer() {
    requestAnimationFrame(() => {
      if (this.container) {
        this.container.style.overflow = 'auto';
        this.container.style.transform = 'translate(0,0)';
      }
    });
  }

  private renderPullDownContent() {
    const {
      releaseContent = releaseContentDefault,
      pullDownContent = pullDownContentDefault,
      refreshContent = refreshContentDefault,
      startInvisible,
    } = this.props;
    const { onRefreshing, pullToRefreshThresholdBreached } = this.state;
    const content = onRefreshing
      ? refreshContent
      : pullToRefreshThresholdBreached
      ? releaseContent
      : pullDownContent;
    const contentStyle: React.CSSProperties = {
      position: 'absolute',
      overflow: 'hidden',
      left: 0,
      right: 0,
      top: 0,
      visibility: startInvisible ? 'hidden' : 'visible',
    };
    return (
      <div id="ptr-pull-down" style={contentStyle} ref={this.pullDownRef}>
        {content}
      </div>
    );
  }

  public render() {
    const { backgroundColor } = this.props;
    const containerStyle: React.CSSProperties = {
      height: 'auto',
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch',
      position: 'relative',
      zIndex: 1,
    };

    if (backgroundColor) {
      containerStyle.backgroundColor = backgroundColor;
    }

    return (
      <div id="ptr-parent" style={containerStyle}>
        {this.renderPullDownContent()}
        <div id="ptr-container" ref={this.containerRef} style={containerStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
