import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext
} from 'react';

import { TreeView, type TreeViewRef } from 'devextreme-react/tree-view';
import * as events from 'devextreme-react/common/core/events';

import { navigation } from '../../app-navigation';
import { useNavigation } from '../../contexts/navigation-hooks';
import { useScreenSize } from '../../utils/media-query';

import './SideNavigationMenu.scss';
import type { SideNavigationMenuProps } from '../../types';
import { ThemeContext } from '../../theme';

/* Navigation item type */
export interface NavigationItem {
  text: string;
  icon?: string;
  path?: string;
  items?: NavigationItem[];
  expanded?: boolean;
}

/* Component */
export default function SideNavigationMenu(
  props: React.PropsWithChildren<SideNavigationMenuProps>
) {
  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady
  } = props;

  const theme = useContext(ThemeContext);
  const { isLarge } = useScreenSize();
  const { navigationData: { currentPath } } = useNavigation();

  const treeViewRef = useRef<TreeViewRef>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);


  const normalizePath = useCallback((): NavigationItem[] => {
    return navigation.map((item: NavigationItem) => ({
      ...item,
      expanded: isLarge,
      path: item.path
        ? `/${item.path.replace(/^\//, '')}`
        : undefined
    }));
  }, [isLarge]);

  const items = useMemo(normalizePath, [normalizePath]);

  /* Wrapper click handler */
  const getWrapperRef = useCallback(
    (element: HTMLDivElement | null) => {
      const prevElement = wrapperRef.current;

      if (prevElement) {
        events.off(prevElement, 'dxclick');
      }

      if (element) {
        wrapperRef.current = element;
        events.on(element, 'dxclick', (e: React.PointerEvent) => {
          openMenu(e);
        });
      }
    },
    [openMenu]
  );

  /* TreeView sync với route */
  useEffect(() => {
    const treeView = treeViewRef.current?.instance();
    if (!treeView) return;

    if (currentPath) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);


  return (
    <div
      className={`dx-swatch-additional${
        theme?.isDark() ? '-dark' : ''
      } side-navigation-menu`}
      ref={getWrapperRef}
    >
      {children}

      <div className="menu-container">
        <TreeView
          ref={treeViewRef}
          items={items}
          keyExpr="path"
          selectionMode="single"
          focusStateEnabled={false}
          expandEvent="click"
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width="100%"
        />
      </div>
    </div>
  );
}