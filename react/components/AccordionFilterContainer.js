import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'
import { Checkbox } from 'vtex.styleguide'

import AccordionFilterItem from './AccordionFilterItem'
import DepartmentFilters from './DepartmentFilters'

import styles from '../searchResult.css'

const CATEGORIES_TITLE = 'store/search.filter.title.categories'

const AccordionFilterContainer = ({
  filters,
  intl,
  onFilterCheck,
  isOptionSelected,
  tree,
  onCategorySelect,
}) => {
  const [openItem, setOpenItem] = useState(null)

  const handleOpen = id => e => {
    e.preventDefault()

    if (openItem === id) {
      setOpenItem(null)
    } else {
      setOpenItem(id)
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      setOpenItem(null)
    }
  }

  const nonEmptyFilters = filters.filter(spec => spec.facets.length > 0)

  const departmentsOpen = openItem === CATEGORIES_TITLE

  const itemClassName = classNames(
    styles.accordionFilterItemOptions,
    'pl5 pt3 h-100 overflow-scroll'
  )

  return (
    <div className={classNames(styles.accordionFilter, 'h-100')}>
      <div
        className={classNames(
          styles.filterAccordionBreadcrumbs,
          'pointer flex flex-row items-center pa5 bg-base w-100 z-max bb b--muted-4'
        )}
      >
        <div
          role="button"
          tabIndex={0}
          className="pv4 flex items-center"
          onClick={() => setOpenItem(null)}
          onKeyDown={handleKeyDown}
        >
          <div
            className={classNames('t-heading-4', {
              'c-muted-2': openItem,
              'c-on-base': !openItem,
            })}
          >
            {intl.formatMessage({
              id: 'store/search-result.filter-breadcrumbs.primary',
            })}
          </div>
        </div>
        {openItem && (
          <div className="pa4 flex items-center">
            <IconCaret orientation="right" size={13} />
            <div className="pl3 t-heading-4 c-on-base">
              {intl.formatMessage({ id: openItem })}
            </div>
          </div>
        )}
      </div>

      <AccordionFilterItem
        title={CATEGORIES_TITLE}
        open={departmentsOpen}
        show={!openItem || departmentsOpen}
        onOpen={handleOpen(CATEGORIES_TITLE)}
      >
        <div className={itemClassName}>
          <DepartmentFilters
            tree={tree}
            isVisible={tree.length > 0}
            onCategorySelect={onCategorySelect}
            hideBorder
          />
        </div>
      </AccordionFilterItem>
      {nonEmptyFilters.map(filter => {
        const { title, facets } = filter
        const isOpen = openItem === filter.title

        return (
          <AccordionFilterItem
            key={filter.title}
            title={title}
            open={isOpen}
            show={!openItem || isOpen}
            onOpen={handleOpen(filter.title)}
          >
            <div className={itemClassName}>
              {facets.map(facet => {
                const { name } = facet

                return (
                  <div
                    className={classNames(
                      styles.filterAccordionItemBox,
                      'pr4 pt3 items-center flex bb b--muted-5'
                    )}
                    key={name}
                  >
                    <Checkbox
                      className="mb0"
                      checked={isOptionSelected(facet)}
                      id={name}
                      label={name}
                      name={name}
                      onChange={() => onFilterCheck(facet)}
                      value={name}
                    />
                  </div>
                )
              })}
            </div>
          </AccordionFilterItem>
        )
      })}
    </div>
  )
}

AccordionFilterContainer.propTypes = {
  /** Current available filters */
  filters: PropTypes.arrayOf(PropTypes.object),
  /** Intl instance */
  intl: intlShape,
  /** Filters mapped for checkbox */
  filtersChecks: PropTypes.object,
  /** Checkbox hit callback function */
  onFilterCheck: PropTypes.func,
  /** Filters selected previously */
  selectedFilters: PropTypes.array,
  isOptionSelected: PropTypes.func.isRequired,
  tree: PropTypes.any,
  onCategorySelect: PropTypes.func,
}

export default injectIntl(AccordionFilterContainer)
