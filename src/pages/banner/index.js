import React, { PureComponent } from 'react';
import Card from '@/components/Card';
import Swipe from '@/components/Swipe';

const img1 = require('@/assets/01.png');
const img2 = require('@/assets/02.png');
const img3 = require('@/assets/03.png');
const img4 = require('@/assets/04.png');
const img5 = require('@/assets/05.png');
const img6 = require('@/assets/06.png');

export default class Banner extends PureComponent {
  render() {
    const option = {
      slidesPerView: 2,
      spaceBetween: 10,
      centeredSlides: true,
      on: {
        slideChange: this.handleChange,
      },
    };
    return (
      <Card title="Banner">
        <Swipe
          options={option}
          ref={ref => {
            this.swiper = ref;
          }}
          thumbOptions={{
            slidesPerView: 4,
            spaceBetween: 10,
          }}
        >
          {[img1, img2, img3, img4, img5, img6].map(item => (
            <div key={item} className="swiper-slide">
              <img src={item} alt="" />
            </div>
          ))}
        </Swipe>
      </Card>
    );
  }
}
