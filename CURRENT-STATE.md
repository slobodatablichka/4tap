## Ordinary-app constraint

Android 4Tap — обычное пользовательское приложение на штатном Android.

Из активной архитектуры и roadmap исключены:
- изменение firmware/SystemUI;
- root и bootloader unlock;
- custom ROM / cross-flash;
- privileged/system app;
- обязательная OEM-интеграция;
- AOSP/Cuttlefish как путь реализации продукта.

Историческая SystemUI/AOSP ветвь хранится только как архив и не является вариантом следующего шага.

## Текущая версия

Интерактивная документация v0.5.

## Реализовано

- единая одностраничная карта KnockUI;
- разделы формируются из `data/sections.json`;
- точное место ячейки задаётся полями `section` и `order` в `data/cells.json`;
- охвачены Android, iOS, WeChat и WhatsApp;
- отражены B2C и B2B;
- добавлены региональная стратегия, roadmap и методология;
- каждая ячейка имеет интерактивное пояснение;
- подробная карточка показывает параметры, входы, выходы, ограничения и открытые вопросы;
- поиск по документации;
- фильтры по платформе и модели;
- фильтр по статусу;
- отдельный фильтр по результату технической проверки;
- типизированные видимые связи между ячейками (`flow / branch / model / constraint / strategy / roadmap / governance`);
- фильтр отображения связей;
- подписи активных связей;
- runtime-проверка ссылочной целостности графа;
- прямые URL на ячейки;
- матрица 1296 двухсимвольных комбинаций, включая пары из одинаковых символов.

## Редактирование

Схема содержательных файлов описана в `data/README.md`. Для добавления разделов, ячеек и связей менять HTML не требуется.

## Аудит полноты

Структурный аудит выполнен. Результаты и исправления зафиксированы в `AUDIT-2026-09-28.md`.

Состояние на момент аудита 2026-09-28:
- 50 ячеек;
- 79 связей;

Текущее состояние карты:
- 73 ячейки;
- 155 связей;
- roadmap развёрнут в шесть этапов: Android end-to-end → Product Canon → User Configuration → Integration Catalog → Launch/Monetization+B2B → Cross-platform;
- Android-поток дополнен разрешениями, валидацией зоны, fail-safe, обратной связью первого символа, хранилищем, редактором назначений, compliance и energy budget;
- iOS и WeChat имеют явные action-узлы;
- общие продуктовые принципы связаны с платформенными адаптациями;
- браузер проверяет несуществующие ссылки, дубликаты, неизвестные section/status/type и изолированные ячейки.

## Техническая верификация

Выполнена первая платформенная техническая проверка. Полный результат: `TECH-VERIFICATION-2026-09-28.md`.

Ключевые результаты:
- вывод проверки 2026-09-28 о пассивном raw-touch «где угодно» сохраняется только для того сценария; 2026-09-29 конкретный navigation-bar trigger через `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` подтверждён на физическом устройстве и снимает его как blocker текущего 4Tap flow;
- `TYPE_APPLICATION_OVERLAY` и permission flow подтверждены как рабочая технология для локального overlay после активации;
- универсальное определение «пустой/неактивной» точки в чужом приложении не может считаться гарантированным;
- Android intents/deep links подтверждены с ограничениями background activity launch и resolver;
- требования Google Play к AccessibilityService и package visibility внесены в документацию;
- проверка 2026-09-28 рассматривала $1 Recognizer как технический ориентир для MVP; текущий implementation-кандидат уже заменил S/C-only прототип собственным profile-driven matcher по 36 каноническим SVG, при этом реальное качество и threshold всё ещё требуют отдельной верификации;
- iOS Custom Keyboard подтверждён как ограниченная input surface; App Review Guideline 4.4.1 блокирует запуск произвольных приложений из keyboard extension;
- WeChat Mini Program подтверждён как локальная/contained среда, не глобальный OS-layer;
- WhatsApp Cloud API подтверждает чатовый command/response transport через webhooks;
- рыночные тезисы вынесены из технической проверки.

На карте появился отдельный узел `android-global-trigger-limitation`, а вводящая в заблуждение прямая flow-связь `android-integration → android-quad-tap` удалена.

## Следующий этап

Первый Android end-to-end рубеж пройден на `LGM-V300L / Android 9`:

`другое приложение → 4 тапа в LEFT/RIGHT области navigation bar → KnockUI → S → C → SC → Android Settings`.

Текущий trigger и KnockUI используют один `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY`; `SYSTEM_ALERT_WINDOW` удалён. ADB/debug broadcast для пользовательской цепочки не требуется. Recognizer v2.1 / Gesture Check / command flow входят в стабильный real-device baseline.

Ближайшие задачи:
1. сохранять текущий recognizer/Gesture Check baseline без изменений до новой воспроизводимой причины;
2. усовершенствовать саму поверхность KnockUI по Design Canon: сначала геометрия и поведение, затем project docs → code → build → real-device test;
3. после Design Canon сделать понятный one-step Accessibility onboarding;
4. подготовить Google Play Accessibility declaration / prominent disclosure / consent / review video и advance notice;
5. повторить механизм на более новых stock Android-устройствах.

## Полнота технических выводов

Все выводы технической проверки разнесены по интерактивным ячейкам, а не оставлены только в TECH-VERIFICATION-2026-09-28.md.

Дополнительно введены архитектурные узлы:
- `platform-adaptation-model` — общий протокол при разных platform entry/action models;
- `android-activation-redesign` — обязательное решение по замене пассивного глобального trigger;
- `ios-action-redesign` — обязательное решение по iOS execution model.

В `verification` соответствующих ячеек теперь фиксируются не только summary/sources/next_step, но и `implication` — архитектурное следствие. Для WeChat также фиксируется `source_note` о необходимости финальной перепроверки по актуальной официальной документации/DevTools.


## Android activation strategy — ordinary app

Подтверждённая текущая модель:

- 4Tap остаётся обычным приложением на штатном Android;
- пользователь выполняет 4 быстрых тапа в LEFT/RIGHT области navigation bar; продуктовый порог по-прежнему рассматривается как 3/4;
- `AccessibilityService` размещает две небольшие touchable `TYPE_ACCESSIBILITY_OVERLAY` зоны в navigation bar;
- полная последовательность формирует `ActivationRequest`;
- после запуска KnockUI trigger-зоны автоматически перевооружаются;
- SystemUI/AOSP/root/privileged/OEM-only пути исключены;
- Accessibility shortcut не используется.

На LG V30 механизм работает стабильно; LG-specific geometry остаётся только диагностическим baseline.

## Android runtime constraints

В публичной карте обновлён узел `android-runtime-constraints`.

Текущий Android-кандидат использует один user-granted capability:

- `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` — и navigation-bar trigger, и KnockUI поверх текущего приложения.

`SYSTEM_ALERT_WINDOW` удалён из manifest и не входит в текущий Android-path. AccessibilityService использует `canRetrieveWindowContent=false` и не читает содержимое экранов.

Google Play допускает AccessibilityService и для приложений, не являющихся accessibility tools, но требует declaration, prominent in-app disclosure, affirmative consent и review. Для приложения с AccessibilityService доступен advance notice App Review.

Текущий onboarding therefore строится вокруг одного пользовательского включения Accessibility; это остаётся UX/compliance задачей, а не техническим blocker.

Остальные runtime-ограничения сохраняются: чувствительные экраны могут скрывать application overlay; запуск действий зависит от background-launch rules и intent/deep-link contracts; Settings Console учитывает package visibility.

## Android navigation-bar activation — PASS 2026-09-29

На физическом `LGM-V300L / Android 9` устойчиво подтверждено:

- Accessibility service `4Tap corner activation` включён пользователем;
- real display `1440×2880`, usable `1440×2733`, navigation bar height `147 px`;
- LEFT zone `(0,2712)`, RIGHT zone `(1104,2712)`, size `336×168 px`;
- обе зоны перекрывают navigation bar `Y=2733…2880`;
- 4 быстрых тапа LEFT/RIGHT стабильно запускают KnockUI;
- `S → C → SC` открывает Android Settings;
- после успешного запуска trigger-зоны автоматически re-arm через 700 ms;
- повторные циклы работают без перевключения AccessibilityService.

Предшествующий `ACTION_OUTSIDE` watcher признан непригодным для угловой фильтрации на LG: события приходили, но координаты тапа были `(0,0)`.

Текущий результат закрывает Stage 1 feasibility, но не утверждает финальную permission architecture.

## Android post-activation drawing

Зафиксировано отдельное техническое положение:
- сложность глобального вызова KnockUI не переносится автоматически на последующее рисование;
- после активации можно использовать небольшой временный touchable `TYPE_APPLICATION_OVERLAY`;
- overlay принимает штрихи KnockUI внутри своей области;
- нижележащее приложение в пределах canvas во время ввода не получает эти касания;
- pass-through для gesture canvas не требуется;
- ограничения Android 12 на untrusted pass-through поэтому не блокируют эту схему.

Добавлена ячейка `android-drawing-overlay`. Основной input flow теперь проходит через неё: `Local Canvas → Drawing Overlay Surface → Gesture 1`.


## Android overlay over WeChat / WhatsApp

Зафиксирована двухконтурная модель:
- на Android после успешной активации 4Tap может открыть временный Drawing Overlay Surface поверх текущего foreground app, в том числе поверх WeChat и WhatsApp;
- одновременно сохраняются собственные внутренние KnockUI-пути: WeChat Mini Program и WhatsApp Business/chat transport;
- эти пути независимы и не заменяют друг друга;
- данное решение относится к Android; iOS рассматривается отдельно.

Добавлена ячейка `android-overlay-over-host-apps`.



## Android prototype baseline

Получен первый подтверждённый результат рабочей реализации `4tap-app`:
- минимальный Android-проект создан и успешно собирается;
- debug APK установлен на физическое Android-устройство;
- приложение успешно запущено;
- контрольный экран `4Tap / KnockUI — RUNNING` подтверждён на устройстве.

Этот результат подтверждает только рабочий Android application baseline. Активация KnockUI, Quad Tap, Drawing Overlay Surface и распознавание жестов ещё не реализованы.

Следующий практический шаг: touch-диагностика и минимальная поверхность ввода, затем распознавание эталонных одноштриховых `S` и `C`.


## Android touch prototype

В рабочем репозитории `4tap-app` подтверждён следующий практический рубеж:
- минимальная touch-поверхность работает на физическом Android-устройстве;
- отображается реальная траектория пальца;
- фиксируются touch events, координаты и тайминги;
- результат подтверждён как `TOUCH OK`.

Следующий prototype subset — только оригинальные Palm Graffiti `S` и `C`. Минимальный направленно-чувствительный распознаватель для этих двух знаков уже реализован в коде и ожидает проверки на физическом устройстве.


## Android SC prototype

В рабочем `4tap-app` подтверждён первый жестовый результат на физическом Android-устройстве:
- touch-поверхность работает;
- оригинальный Palm Graffiti `S` распознаётся;
- оригинальный Palm Graffiti `C` распознаётся;
- последовательность `S → C` корректно формирует команду `SC`.

Это ограниченная верификация только двух эталонов и одной тестовой команды. Она не подтверждает качество полного алфавита A–Z / 0–9.

Следующий практический шаг — перенести уже работающий ввод в post-activation KnockUI flow с временной локальной поверхностью, сохранив диагностику.


## Android in-app end-to-end prototype

На физическом Android-устройстве подтверждена ограниченная сквозная цепочка внутри launcher Activity:
- левый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- правый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- после завершения canvas закрывается и последняя команда сохраняется на экране ожидания.

Результат зафиксирован как `LEFT SC OK`, `RIGHT SC OK`.

Граница подтверждения принципиальна: угловые зоны и canvas пока находятся внутри самого 4Tap-приложения. Это проверяет UX/тайминги/распознавание и внутреннюю композицию цепочки, но не доказывает глобальный Android/OEM Quad Tap и не является проверкой `TYPE_APPLICATION_OVERLAY` поверх чужого приложения.

Следующий Android-эксперимент — настоящий временный touchable overlay с тем же подтверждённым `S → C → SC`.


## Android overlay real-device verification

Подтверждён post-activation drawing на физическом Android-устройстве:
- настоящий touchable `TYPE_APPLICATION_OVERLAY` создаётся после тестовой in-app активации;
- overlay остаётся поверх другого foreground-приложения;
- Palm Graffiti `S → C` распознаётся внутри overlay;
- команда `SC` формируется корректно;
- overlay автоматически закрывается после команды;
- сценарий подтверждён для левой и правой стороны: `LEFT OVERLAY SC OK`, `RIGHT OVERLAY SC OK`.

Это существенно сужает Android-риск: post-activation input surface и двухсимвольное распознавание подтверждены. Неподтверждённым остаётся системный/OEM activation trigger, который должен вызывать уже рабочий overlay без предварительного открытия 4Tap Activity.


## Android activation contract verified

После архитектурного разделения повторно подтверждён полный downstream-контур на физическом Android-устройстве:
- `ActivationRequest`;
- `OverlayLauncher`;
- настоящий `TYPE_APPLICATION_OVERLAY`;
- Palm Graffiti recognizer;
- двухсимвольная команда `SC`.

Контрольный результат: `REFACTOR LEFT SC OK`, `RIGHT SC OK`.

Это подтверждает, что источник активации можно менять независимо от overlay/recognizer/command. Текущий in-app 4-tap остаётся test harness. Неподтверждённым остаётся ordinary-app lower-corner trigger, который должен подать тот же `ActivationRequest`.


## Android external activation adapter verified

Подтверждён внешний debug activation adapter на физическом Android-устройстве без предварительного открытия 4Tap Activity:

- explicit broadcast формирует тестовый `ActivationRequest`;
- уже проверенный `OverlayLauncher` открывает настоящий Drawing Overlay поверх другого foreground-приложения;
- `S → C → SC` завершается корректно;
- подтверждены обе стороны: `OEM LEFT SC OK`, `OEM RIGHT SC OK`.

Несмотря на историческое имя `OEM_SYSTEMUI_TEST`, этот adapter является только test harness. Он не задаёт production-архитектуру и не означает зависимость от OEM/SystemUI.

Конкретный production trigger — ordinary-app 3/4-tap sequence в нижнем углу — ещё требует end-to-end проверки.

## Android command action verified

На штатном `LGM-V300L / Android 9` подтверждён следующий рубеж:
- внешний debug trigger формирует `ActivationRequest`;
- настоящий `TYPE_APPLICATION_OVERLAY` открывается поверх другой программы;
- `S → C` формирует `SC`;
- после завершения команды overlay закрывается;
- `SC` запускает назначенное тестовое действие `Settings.ACTION_SETTINGS`.

Таким образом, downstream теперь подтверждён до реального Android action execution:

`ActivationRequest → OverlayLauncher → Drawing Overlay → Recognizer → Command → Action`.

Единственный незакрытый риск Stage 1 — ordinary-app lower-corner 3/4-tap activation без ADB/debug broadcast.

## LG V30 raw touch baseline

Для основной опытной площадки определён touchscreen input-device:

- node: `/dev/input/event1`;
- name: `touch_dev`;
- property: `INPUT_PROP_DIRECT`;
- raw X: `0..1439`;
- raw Y: `0..2879`.

Raw coordinate space совпадает с physical display `1440 × 2880` один-к-одному. Поэтому дальнейшие system-corner tests можно фиксировать непосредственно в физических координатах экрана.

## LG V30 test geometry baseline

Для первой физической Android-площадки `LGM-V300L / Android 9 / V300L30p` зафиксирована текущая геометрия:

- display: `1440 × 2880 px`;
- physical density: `640 dpi`;
- override density: `560 dpi`;
- `NavigationBar`: `[0,2733][1440,2880]`;
- высота панели: `147 px`.

Это диагностический baseline конкретного LG. Эти значения не задают product trigger geometry и не используются как доказательство ownership.

## Android lower-corner activation — canon

Каноническая модель:

- 4Tap — ordinary user app;
- нижний LEFT и RIGHT угол дают целевую область вызова;
- активация — **3 или 4 быстрых тапа**;
- если 4Tap получает всю последовательность, формируется `ActivationRequest`;
- если один или несколько тапов не получены из-за активности приложения, системы или другого обработчика, серия сбрасывается и активация не происходит;
- такой отказ считается естественным ограничением конкретного контекста;
- не требуется отдельная модель ownership/passthrough/replay;
- `TYPE_APPLICATION_OVERLAY` используется только после активации как Drawing Overlay.

Текущая задача — проверить именно эту последовательность на физическом устройстве, а не исследовать SystemUI или точную границу NavigationBar.

## Android SystemUI Quad Tap zone — archived

Ранее исследованная reserved-zone/SystemUI/AOSP ветвь закрыта и сохранена только в истории проекта.

Она не является:
- текущей архитектурой;
- запасным implementation path;
- roadmap branch;
- способом исправлять неудачные угловые активации.

Пользовательский 4Tap должен оставаться обычным приложением на штатном Android.

## Product / UX plan update

В ближайший Android-контур добавлены обязательные продуктовые задачи:

- `4Tap Design Canon`: v0.1 до существенной переработки KnockUI overlay, v0.2 после первой полной real-device цепочки, v1.0 перед публичной beta;
- `4Tap Graffiti Profile`: Palm Graffiti остаётся baseline, но 4Tap утверждает собственные канонические формы; неудобные знаки могут меняться, символ `X` уже вынесен на отдельную проверку;
- `4Tap Settings Console`: установленные/доступные приложения, default-привязки, обучение написанию знаков, UserGestures и пользовательская привязка команды к приложению/действию;
- Settings Console должен поддерживать отдельный приватный профиль `Founder 40`; сами 40 сокращений не публикуются в публичной карте;
- `Default Integration Catalog — Russia`: сначала проверенный app launch, затем документированные deep links/actions;
- российский launch: RuStore как основной канал, другие Android-магазины и Google Play как дополнительные;
- monetization baseline: Free + Pro, subscription только за продолжающийся сервис, B2B/OEM отдельно, без рекламы внутри основного KnockUI-flow;
- продвижение — demo-first: короткая реальная цепочка «текущий контекст → 4Tap → два знака → действие».

Эти направления зафиксированы отдельными связанными ячейками карты и входят в roadmap, а не считаются пост-MVP неопределённостями.

## Current public-map alignment

Публичная карта синхронизирована с рабочим планом `4tap-app`:

- подтверждённый Android milestone: другая программа → 3/4 быстрых угловых тапа → KnockUI → двухзнаковая команда → действие; текущий recognizer v2.1 / Gesture Check / command flow — stable real-device baseline;
- Android activation описан как ordinary-app lower-corner sequence;
- неудачная/неполная tap sequence означает reset, а не переход к системной модификации;
- SystemUI/AOSP ветвь помечена архивной и удалена из активного roadmap-графа;
- Local Canvas связан с общим `ActivationRequest`;
- текущий Product Canon focus — усовершенствование поверхности KnockUI; Design Canon, 4Tap Graffiti Profile, Settings Console, Founder 40 privacy rule и Russia Integration Catalog остаются в roadmap;
- RuStore остаётся primary Russia channel, Google Play и другие магазины — дополнительными;
- monetization и promotion сохранены отдельными продуктными узлами.

## Pair Selection / Command Space — current

Текущая каноническая модель выбора XY:

- Command Space содержит 1296 пар `A–Z + 0–9`; одинаковые пары разрешены;
- `Pair Selection / Выбор знакопары` — единственный механизм назначения XY;
- первый уровень: 36 Graffiti-знаков `6 × 6`;
- второй уровень: 36 вторых Graffiti-знаков `6 × 6`;
- задача второго уровня — только завершить выбор свободной `XY`;
- целевая строка второго уровня: `[Graffiti X] + [второй слот]`, без действия `ВЕДЕТ В`;
- после любой успешно выбранной свободной XY Pair Selection **всегда** открывает `Проверка жеста`;
- занятая пара в `КОМБИНАЦИИ` может открыть существующую `Command`;
- текстовый поиск `A–Z + 0–9` остаётся отдельной навигацией по Command Space;
- рисование не используется для назначения XY.

Текущий Android Command Space уже содержит двухэтапный 6×6 выбор, но ещё требует приведения второго уровня к этому целевому flow и повторного real-device review.

## Canonical Back header refinement

Утверждено общее правило header:

- если иное отдельно не предусмотрено, `Back` располагается слева в верхней заголовочной строке;
- header — `72 dp`;
- touch-area Back — `48 × 48 dp`;
- базовая грамматика: `Back → контекст (если нужен) → название поверхности → действия справа`.

Применено в Android-коде:

- `Commands`: `Back | КОМАНДЫ | Search | Menu`;
- `Destination`: `Back | [slot 1][slot 2] | ВЕДЕТ В`;
- существующая команда показывает в этих слотах текущий Graffiti XY без start/direction markers;
- новая команда через `ADD COMMAND → Destination` показывает два пустых слота.

Refinement реализован и ожидает повторный real-device review.

## Design Canon normalization — canon/graphics gate

После real-device просмотра UI зафиксировано новое обязательное правило разработки:

`общий Design Canon → реестр канонической графики → локальный канон поверхности → код`.

Если правила или нужного графического элемента нет, UI-реализация не начинается до его утверждения/создания.

Нормализовано:

- Back / Menu / Search: touch-area `48 × 48 dp`, видимая каноническая графика `40 × 40 dp`;
- Search является рамочной фирменной пиктограммой; системный Android search icon не используется по умолчанию;
- Frame зарегистрирован как канонический пустой квадрат для слотов/контейнеров;
- внутренняя геометрия и рамка определяются asset, а не отдельной приблизительной цифрой в локальном экране;
- один Back находится в верхнем header и выполняет один уровень назад в текущем контексте;
- второй уровень Command Space больше не имеет дублирующего Back в контекстной строке;
- текущий Android UI требует отдельного conformance-fix; новый PASS пока не зафиксирован.

## Android UI canon-conformance — implemented

По уже реализованным Android-поверхностям выполнено приведение к нормализованному Design Canon:

- добавлены точные Android-производные канонических `Search` и `Frame`;
- `Back / Search / Menu` используют общую схему `48 × 48 dp touch → 40 × 40 dp visible`;
- системный Android Search удалён из `Commands` и `Destination`;
- Menu больше не уменьшается произвольным padding/alpha;
- второй уровень `КОМБИНАЦИИ` больше не содержит дублирующий Back;
- верхний Back на втором уровне возвращает к первому уровню, аппаратный Back ведёт так же;
- слоты `Commands` и `Destination` используют канонический Frame;
- `Command` использует тот же общий helper канонического Back;
- KnockUI/MainActivity не содержат затронутых header-actions/Frame и в этом блоке не менялись.

Новый conformance-pass ещё не получил real-device PASS: требуется `assembleDebug` и повторная проверка на устройстве.

## Command creation / Gesture Check routing — current

Обе ветки используют общий блок:

`Pair Selection → Проверка жеста`.

`Проверка жеста` можно выполнить или пропустить; она не меняет XY.

Маршрутизационный инвариант после проверки:

1. известна `XY`, Destination отсутствует → `ВЕДЕТ В`;
2. Destination был выбран **до XY** через `НАЗНАЧИТЬ` → после выбора XY известны обе части → `КОМАНДА`;
3. при редактировании существующей команды Destination уже известен → новая XY возвращается в `КОМАНДА`.

Общее правило:

`XY + no Destination → ВЕДЕТ В`  
`XY + Destination → КОМАНДА`.

Отсюда два create-flow:

- destination-first: `ADD COMMAND → НАЗНАЧИТЬ → Destination → Pair Selection → Проверка жеста → Command`;
- pair-first: `Commands / КОМБИНАЦИИ → Pair Selection → Проверка жеста → ВЕДЕТ В → Destination → Command`.

Редактирование XY:

`Command → Pair Selection → Проверка жеста → Command`.

`ВЕДЕТ В` всегда требует известную XY. `НАЗНАЧИТЬ` используется только тогда, когда Destination выбирается до XY.

Android-маршрутизация подтверждена на физическом устройстве 2026-10-01: destination-first и pair-first проходят до конца. Новая созданная команда после этого трижды успешно выполнена через KnockUI. Existing-Command XY edit остаётся отдельной непроверенной device-веткой.

## Pair Selection — contextual geometry approved

The public architecture now records one shared Pair Selection geometry:

- one core for all contexts: persistent `[X] + [Y]` context row + `6×6 X → 6×6 Y`;
- the context row stays in the same place on both stages, so the grid does not jump;
- stage 1 shows `[□] + [□]`; stage 2 shows `[X] + [□]`;
- when Destination is already known it is shown at right as `ДЛЯ: Destination`;
- standalone destination-first/edit surface: `Back | ЗНАКОПАРА | Search`;
- Commands / КОМБИНАЦИИ hosts the same core under its existing Commands header and mode switch;
- free XY always goes directly to `Проверка жеста`; there is no `ДАЛЬШЕ`, `ВЕДЕТ В`, or `ДОБАВИТЬ КОМАНДУ` inside Pair Selection;
- occupied families/pairs are muted; Commands may inspect an occupied pair, while creation/edit cannot select it;
- the current self-pair of an edited Command does not conflict with itself;
- Search is navigation through the same selector: 1 character → X/Y stage, 2 characters → exact XY;
- Back: Y→X; standalone X after НАЗНАЧИТЬ→НАЗНАЧИТЬ preserving Destination; standalone X from Command→Command unchanged.

Pair Selection geometry is approved. The shared `PairSelectionGridView` + standalone `ЗНАКОПАРА` are present in the current Android baseline; pair-first and destination-first flows passed on a physical device. Existing-Command XY edit remains a separate explicit device check.

## Gesture Check — approved base surface

The public architecture now records the concrete Gesture Check behavior:

- `Back | ПРОВЕРКА ЖЕСТА`;
- both `[X] + [Y]` examples remain visible;
- при входе активен X и действует режим `AUTO`;
- успешный X в `AUTO` автоматически переводит активность на Y; FAIL не переключает знак;
- любой явный тап пользователя по X или Y переводит сессию в `MANUAL`, после чего автопереключение отключено;
- любой знак можно перерисовывать без ограничения, включая после PASS;
- один fixed drawing canvas не меняет положение из-за recognition feedback;
- feedback текстовый; новые PASS/FAIL pictograms не вводятся;
- fixed four-line zone резервирует до двух строк для последнего X-result и двух для Y;
- новая попытка очищает старый feedback только активного знака уже на `ACTION_DOWN`; результат второго знака сохраняется;
- before any attempt the bottom action is `ПРОПУСТИТЬ`; after an attempt it is `ПРОДОЛЖИТЬ`;
- PASS/FAIL never gates continuation and is not persisted as part of Command;
- exit routing remains `XY + no Destination → ВЕДЕТ В`, `XY + Destination → КОМАНДА`.

The current Android build uses a 72 dp pair row, adaptive canvas, fixed four × 24 dp feedback lines and fixed 56 dp bottom action. These implementation-level values are present in the stable physical-device baseline, but they are not promoted to generic canon solely by that stability result.

## Pair Selection / Gesture Check / Recognizer — Android candidate implemented

Private `4tap-app` now contains the complete implementation candidate for the approved command-flow block:

- one shared `PairSelectionGridView` for Commands, destination-first and existing-Command edit;
- standalone `Back | ЗНАКОПАРА | Search` surface;
- pair-first: `XY → Gesture Check → ВЕДЕТ В → Destination → Command`;
- destination-first: `НАЗНАЧИТЬ → Destination → ЗНАКОПАРА → Gesture Check → Command`;
- edit: `Command → ЗНАКОПАРА → Gesture Check → Command`;
- Gesture Check supports arbitrary X/Y switching, unlimited retries, independent latest-result feedback and non-blocking skip/continue;
- recognizer now loads all 36 canonical Profile v1 SVG strokes instead of hardcoded S/C templates;
- recognizer tests were added for all canonical self-matches, scale/translation invariance and S/5, I/1, Z/2.

Current verification status:

1. `testDebugUnitTest` — PASS (`BUILD SUCCESSFUL`, 2026-10-01);
2. `assembleDebug` — PASS (`BUILD SUCCESSFUL`, 2026-10-01);
3. pair-first and destination-first creation — real-device PASS;
4. newly created command execution through KnockUI — PASS ×3;
5. recognizer v2.1 / Gesture Check / current command flow — stable physical-device baseline;
6. Existing-Command XY edit — still requires its own explicit device check.

## Real-device command creation + recognizer review — 2026-10-01

Confirmed:

- destination-first creation — PASS;
- pair-first creation — PASS;
- a newly created command executed through KnockUI three times — PASS ×3.

Gesture Check / recognizer findings:

- current 36-symbol recognizer pipeline runs, but many finger-drawn symbols are misclassified;
- old F was especially impractical to recognize and is now replaced by a new canonical phi-like `Letter-F.svg`;
- Gesture Check has a stale-feedback bug: retry begins while the previous active-sign result remains visible;
- approved fix: clear only active-sign feedback at stroke start, keep the other sign's result;
- approved X/Y logic: start X in AUTO, X PASS → Y; any manual X/Y tap switches to MANUAL and disables further auto-switching for that session.

Recognizer v2 is now specified as bounded DTW-like trajectory alignment using position + local tangent/direction + turning/curvature. Real trace accumulation/analysis is deliberately deferred. Future personalization is reserved as `common templates + several user-specific samples`.

## Recognizer v2 + Gesture Check refinement — implemented candidate

Private `4tap-app` now contains the approved next code pass:

- canonical revised F is consumed from the same Profile v1 SVG source;
- Gesture Check clears stale active-sign feedback at `ACTION_DOWN`;
- X/Y switching starts in `AUTO`: X PASS → Y; any explicit slot tap switches the session to `MANUAL`;
- recognizer v2 uses 64-sample preprocessing plus bounded DTW;
- local comparison cost combines normalized position (0.55), tangent/direction (0.30) and local turn (0.15);
- DTW band is 18% of sequence length with minimum 6 samples; non-diagonal warp steps carry a 0.01 penalty;
- no real user traces are accumulated and no personalization is active.

Status: `testDebugUnitTest` and `assembleDebug` are PASS (`BUILD SUCCESSFUL`, 2026-10-01). Real-device recognition review is still pending.

## iOS implementation options

iOS больше не описывается как keyboard-only архитектура. Зафиксированы варианты реализации, окончательный выбор отложен.

Entry candidates:
- `Custom Keyboard Extension` — ввод внутри text-entry контекста;
- `Back Tap` — системный Double Tap/Triple Tap по задней панели с запуском Shortcut;
- `Action Button` — запуск Shortcut/Control на поддерживаемых моделях;
- `Control Center / Lock Screen Control` — WidgetKit Control.

Общий системный мост:
- `App Intents / Shortcuts Bridge` — связывает перечисленные системные triggers с действиями KnockUI.

Важно:
- эти механизмы не создают произвольный overlay поверх чужого iOS-приложения;
- часть App Intents может выполнять действие без отдельного UI, но это проверяется предметно для каждой команды;
- открытие приложения через intent/shortcut переводит пользователя в KnockUI app;
- конкретная комбинация entry/action paths пока не утверждена.

Добавлены ячейки `ios-back-tap`, `ios-action-button`, `ios-system-controls`, `ios-app-intents-shortcuts`. Ячейка `ios-activation` преобразована в общий узел вариантов.

## Accessibility-only KnockUI — PASS

2026-09-29 на `LGM-V300L / Android 9` подтверждена полная цепочка при выключенном системном доступе «Поверх других приложений»: `4 taps → AccessibilityService → TYPE_ACCESSIBILITY_OVERLAY KnockUI → S → C → SC → Settings`.

`SYSTEM_ALERT_WINDOW` затем полностью удалён из `AndroidManifest.xml`, сборка переустановлена и та же цепочка повторно прошла — PASS. Текущий Android-кандидат требует одного пользовательского системного включения: `4Tap corner activation` в Accessibility.


## Recognizer v2.1 — Q / O-Q / 4-9 refinement

Physical-device review found:

- `O → Q`;
- `4 → 9` in ten consecutive attempts.

The private implementation repo now contains:

- revised canonical `Letter-Q.svg`;
- updated Q checksum;
- generic template orientation from the canonical start marker, because raw SVG path order was found reversed for at least `C`, `O` and `4`;
- endpoint-aware score: start point/direction + end point/direction;
- extra terminal-tail weight over the last 13 of 64 samples;
- no symbol-specific classifier exceptions.

Status: implementation committed; new unit/build/device verification pending.


## Stable Android recognizer baseline — 2026-10-01

After installing the build with revised Q, marker-oriented templates and endpoint/tail-aware recognizer v2.1, the user confirmed on a physical Android device:

**the current 4Tap works well and stably.**

This closes the pending physical-device verification status for recognizer v2.1 / Gesture Check / current command flow and establishes them as the current Android baseline.

Further recognizer changes are opened only for new reproducible problems or a separate planned calibration/personalization stage.
