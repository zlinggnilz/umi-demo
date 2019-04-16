import React, { PureComponent, Fragment } from 'react';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class SwipeCustom extends PureComponent {
  static propTypes = {
    options: PropTypes.object,
    thumbOptions: PropTypes.object,
  };

  static defaultProps = {
    options: {},
    thumbOptions: {},
  };

  swiper = null;

  thumbSwiper = null;

  componentDidMount() {
    const { options, thumbOptions } = this.props;
    this.swiper = new Swiper(this.swiperEl, {
      loop: true,
      lazy: {
        loadPrevNext: true,
      },
      slidesPerView: 1,
      slidesPerGroup: 1,
      // pagination: {
      //   el: this.paginateEl,
      // },
      navigation: {
        nextEl: this.swiperEl.querySelector('.swiper-button-next'),
        prevEl: this.swiperEl.querySelector('.swiper-button-prev'),
      },
      ...options,
      thumbs: {
        swiper: {
          el: this.thumbEl,
          loop: true,
          lazy: {
            loadPrevNext: true,
          },
          navigation: {
            nextEl: this.thumbEl.querySelector('.swiper-button-next'),
            prevEl: this.thumbEl.querySelector('.swiper-button-prev'),
          },
          ...thumbOptions,
        },
      },
    });
  }

  render() {
    const { children, options, thumbOptions, thumbChidren } = this.props;
    return (
      <Fragment>
        <div
          className={`swiper-container ${options.centeredSlides ? styles.centerMode : ''}`}
          ref={ref => {
            this.swiperEl = ref;
          }}
        >
          <div className="swiper-wrapper">{children}</div>
          {/* <div
            className="swiper-pagination banner-pagination"
            ref={ref => {
              this.paginateEl = ref;
            }}
          /> */}
          <div className="swiper-button-next swiper-button-white" />
          <div className="swiper-button-prev swiper-button-white" />
        </div>
        <div
          className={`swiper-container ${thumbOptions.centeredSlides ? styles.centerMode : ''}`}
          ref={ref => {
            this.thumbEl = ref;
          }}
          style={{ marginTop: 16 }}
        >
          <div className="swiper-wrapper">{thumbChidren || children}</div>
          <div className="swiper-button-next swiper-button-white" />
          <div className="swiper-button-prev swiper-button-white" />
        </div>
      </Fragment>
    );
  }
}
