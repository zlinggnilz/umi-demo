import React, { PureComponent, Fragment } from 'react';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import styles from './banner.less';

export default class SwipeCustom extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    options: PropTypes.object,
    thumbData: PropTypes.array,
    thumbOptions: PropTypes.object,
  };

  static defaultProps = {
    data: [],
    options: {},
    thumbOptions: {},
  };

  swiper = null;

  thumbSwiper = null;

  componentDidMount() {
    const { options, thumbOptions, data } = this.props;
    if (!data.length) return;
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
          // loop: true,
          lazy: {
            loadPrevNext: true,
          },
          slidesPerView: 6,
          slidesPerGroup: 1,
          pagination: {
            el: this.thumbWrap.querySelector('.swiper-pagination'),
            clickable: true,
          },
          // navigation: {
          //   nextEl: this.thumbWrap.querySelector('.swiper-button-next'),
          //   prevEl: this.thumbWrap.querySelector('.swiper-button-prev'),
          // },
          ...thumbOptions,
        },
      },
    });
  }

  render() {
    const { options, thumbOptions, thumbData, data } = this.props;
    if (!data.length) return null;
    return (
      <Fragment>
        <div
          className={`swiper-container ${options.centeredSlides ? styles.centerMode : ''}`}
          ref={ref => {
            this.swiperEl = ref;
          }}
        >
          <div className="swiper-wrapper">
            {map(data, (item, index) => (
              <div className="swiper-slide" key={`${item.src}-${index}`}>
                <img src={item.src} alt={item.alt} />
              </div>
            ))}
          </div>
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
          className={styles.thumWrap}
          ref={ref => {
            this.thumbWrap = ref;
          }}
        >
          <div
            className={`swiper-container ${thumbOptions.centeredSlides ? styles.centerMode : ''}`}
            ref={ref => {
              this.thumbEl = ref;
            }}
          >
            <div className="swiper-wrapper">
              {map(thumbData || data, (item, index) => (
                <div className="swiper-slide" key={`${item.src}-${index}`}>
                  <img src={item.src} alt={item.alt} />
                </div>
              ))}
            </div>
          </div>
          <div className="swiper-pagination" />
          {/* <div className="swiper-button-next swiper-button-black" />
          <div className="swiper-button-prev swiper-button-black" /> */}
        </div>
      </Fragment>
    );
  }
}
