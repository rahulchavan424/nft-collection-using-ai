/*
| Developed by Starton
| Filename : AppLayout.tsx
| Author : Philippe DESPLATS (philippe@starton.io)
*/

import React from 'react'
import { Box, GlobalStyles } from '@mui/material'
import { AppLayoutHeader } from './AppLayoutHeader'
import { AppLayoutFooter } from './AppLayoutFooter'

/*
|--------------------------------------------------------------------------
| Contracts
|--------------------------------------------------------------------------
*/
export interface AppLayoutProps {
	children: React.ReactNode
}

/*
|--------------------------------------------------------------------------
| Global styles
|--------------------------------------------------------------------------
*/
const inputGlobalStyles = (
	<GlobalStyles
		styles={(theme) => ({
			/* width */
			'&::-webkit-scrollbar': {
				width: '8px',
				height: '8px',
			},

			/* Track */
			'&::-webkit-scrollbar-track': {
				background: theme.palette.divider,
			},

			/* Handle */
			'&::-webkit-scrollbar-thumb': {
				background: theme.palette.background.paper,
				borderRadius: 5,
				borderStyle: 'solid',
				borderWidth: '1px',
				borderColor: theme.palette.divider,
			},

			'&::-webkit-scrollbar-corner': {
				background: 'transparent',
			},
		})}
	/>
)

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/
export const AppLayout: React.FC<AppLayoutProps> = (props) => {
	return (
		<React.Fragment>
			{props.children}
		</React.Fragment>
	)
}

/*
|--------------------------------------------------------------------------
| Component configurations
|--------------------------------------------------------------------------
*/
AppLayout.displayName = 'AppLayout'