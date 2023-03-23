// Section.js
import React, { forwardRef } from "react";
import styled from "styled-components";

const SectionContainer = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 20px;
`;

const SectionContent = styled.p``;

const Section = forwardRef(({ title, content }, ref) => {
    return (
        <SectionContainer ref={ref}>
            <SectionTitle>{title}</SectionTitle>
            <SectionContent>{content}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam aperiam atque aut, debitis enim id ipsa laudantium mollitia nam nobis provident quaerat quasi saepe sunt vitae voluptas voluptate voluptatum!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi eos eveniet, exercitationem illo modi molestiae perspiciatis qui quo! Animi fugit minus molestiae neque perferendis porro recusandae tempora vero voluptate.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam amet animi aspernatur dolor eius ipsa laudantium libero molestiae necessitatibus, odio provident quis recusandae repellat repellendus sapiente soluta unde veniam!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti in optio ratione voluptates! Aliquam blanditiis cumque in laboriosam, possimus quod repudiandae velit? Culpa ea eligendi, laboriosam neque provident reprehenderit voluptatum.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem blanditiis dolorem eaque laudantium nisi officiis. Maiores necessitatibus, recusandae? Accusantium, adipisci aperiam eaque error iure labore minus necessitatibus numquam repellendus!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, fuga, sint? Aliquam eum ipsam officia ratione tenetur! A, beatae dignissimos facere hic inventore minima modi natus, nobis numquam quas, soluta.

            </SectionContent>
        </SectionContainer>
    );
});
Section.displayName = "Section"
export default Section;
