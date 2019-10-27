<template>
  <nav class="navigation">
    <div class="navigation__main">
      <RouterLink
        class="navigation__item"
        active-class="navigation__item--active"
        :to="{ name: 'dashboard' }"
      >
        <FontAwesomeIcon
          class="navigation__icon"
          icon="columns"
        />
      </RouterLink>
    </div>
    <div class="navigation__admin">
      <RouterLink
        class="navigation__item"
        active-class="navigation__item--active"
        :to="{ name: 'editor' }"
      >
        <FontAwesomeIcon
          class="navigation__icon"
          icon="layer-group"
        />
      </RouterLink>
    </div>
    <div class="navigation__item navigation__item--toggle">
      <FontAwesomeIcon
        class="navigation__icon"
        :icon="['far', 'arrow-alt-circle-right']"
      />
    </div>
  </nav>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { faColumns, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

library.add(
  faArrowAltCircleRight,
  faColumns, faLayerGroup,
);

export default {
  name: 'Navigation',
};
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.navigation {
  display: flex;
  flex-direction: column;
  width: 50px;
  background: $gray-600;
}

.navigation__main {
  flex: 1;
}

.navigation__item {
  display: block;
  position: relative;
  height: 50px;
  cursor: pointer;
}

.navigation__item--active {
  background-color: $gray-700;
}

.navigation__item:hover {
  background-color: $gray-800;
}

.navigation__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25px;
  color: $gray-100;
}

.navigation__item--toggle:hover {
  background-color: $gray-100;
}

.navigation__item--toggle:hover .navigation__icon {
  color: $gray-600;
}
</style>
