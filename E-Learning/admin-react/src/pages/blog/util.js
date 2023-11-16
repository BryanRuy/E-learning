const badgeColorsArr = {
    1: 'light-info',
    2: 'light-primary',
    3: 'light-danger',
    4: 'light-warning',
    5: 'light-success'
}

export const getCategoryBadgeColor = (index = 0) => {

    return badgeColorsArr[(index + 1) % 6 || 1];
}